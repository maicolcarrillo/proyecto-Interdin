<template>
    <div class="mt-6">
        <div class="p-6 border border-gray-300 rounded-xl shadow-2xl bg-white">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Configuración de créditos para Austro:</h3>
            <div class="grid grid-cols-1 gap-6">
                <div v-for="plan in autroPlans" :key="plan" class="flex flex-col space-y-2">
                    <label class="flex items-center space-x-3">
                        <input type="checkbox" :checked="selectedPlans.includes(plan)"
                            @change="handleCheckboxChange(plan, $event)"
                            class="w-5 h-5 text-blue-500 accent-blue-600" />
                        <span class="font-medium text-gray-700">{{ plan }}</span>
                    </label>
                    <div v-if="selectedPlans.includes(plan) && plan !== 'Corriente'"
                        class="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <input type="text" :value="selectedValues[plan]"
                            @input="updateSelectedValues(plan, $event.target.value)"
                            class="p-2 mt-5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="En meses" />
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                            <input type="number" :value="minValues[plan]"
                                @input="updateMinValues(plan, $event.target.value)"
                                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ej:1" />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                            <input type="number" :value="maxValues[plan]"
                                @input="updateMaxValues(plan, $event.target.value)"
                                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ej: 999999" />
                        </div>
                    </div>
                    <!-- Checkbox para meses de gracia -->
                    <div v-if="selectedPlans.includes(plan) && ['Diferido Propio (Con interes)', 'Diferido corriente (Sin interes)'].includes(plan)"
                        class="ml-6">
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" v-model="graceMonthsEnabled[plan]" />
                            <span class="text-sm font-bold">Meses de gracia</span>
                        </label>

                        <!-- Inputs dinámicos solo si el checkbox está activado -->
                        <div v-if="graceMonthsEnabled[plan]" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div class="flex flex-col space-y-7">
                                <div v-for="month in [1, 2, 3]" :key="month" class="flex flex-row gap-6">
                                    <!-- Input del Mes -->
                                    <div class="flex-1">
                                        <input type="text" :value="graceMonths[plan]?.[month - 1] || ''"
                                            @input="updateGraceMonths(plan, month - 1, $event.target.value)"
                                            class="p-2 border border-gray-300 rounded-lg w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            :placeholder="`Diferido ${month} mes de gracia`" />
                                    </div>
                                    <!-- Input del Monto Mínimo -->
                                    <div class="flex-1">
                                        <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                                        <input type="number" :value="graceMinValues[plan]?.[month - 1] || ''"
                                            @input="updateGraceMinValues(plan, month - 1, $event.target.value)"
                                            class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Ej: 1" />
                                    </div>
                                    <!-- Input del Monto Máximo -->
                                    <div class="flex-1">
                                        <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                                        <input type="number" :value="graceMaxValues[plan]?.[month - 1] || ''"
                                            @input="updateGraceMaxValues(plan, month - 1, $event.target.value)"
                                            class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Ej: 999999" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="generateJSON" :disabled="!hasAtLeastOneValidPlan" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4 transition-all 
                disabled:bg-gray-400 disabled:cursor-not-allowed">
                Generar JSON
            </button>
            <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px] mt-6">
                <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-300 text-sm">JSON Formateado</span>
                        <button @click="copyToClipboard(jsonFormatted)"
                            class="text-gray-400 hover:text-white transition-colors">
                            📝 Copiar
                        </button>
                    </div>
                    <pre class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom">
                        <code class="bg-gray-800/50 p-2 rounded inline-block min-w-full">{{ jsonFormatted }}</code>
                    </pre>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-300 text-sm">JSON Compacto</span>
                        <button @click="copyToClipboard(jsonCompact)"
                            class="text-gray-400 hover:text-white transition-colors">
                            📝 Copiar
                        </button>
                    </div>
                    <pre class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom">
                        <code class="bg-gray-800/50 p-2 rounded">{{ jsonCompact }}</code>
                    </pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    autroPlans: { type: Array, required: true, default: () => [] }
});

const emit = defineEmits(['update:json']);

const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});
const graceMonths = ref({});
const graceMonthsEnabled = ref({});
const graceMinValues = ref({});
const graceMaxValues = ref({});

const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

// Nueva validación computada
const hasAtLeastOneValidPlan = computed(() => {
    return selectedPlans.value.some(plan => {
        // El plan "Corriente" no necesita meses
        if (plan === 'Corriente') return true;

        // Verificar meses principales
        const hasMainMonths = selectedValues.value[plan] &&
            (typeof selectedValues.value[plan] === 'string' ?
                selectedValues.value[plan].trim() !== '' : true);

        // Verificar si tiene meses de gracia habilitados
        const hasGraceMonths = graceMonthsEnabled.value[plan] &&
            graceMonths.value[plan]?.some(month => month && month.trim() !== '');

        return hasMainMonths || hasGraceMonths;
    });
});

const planToLetterMap = {
    "Diferido Sin interes especial": "X",
    "Diferido Propio (Con interes)": "P",
    "Diferido corriente (Sin interes)": "D",
    "Corriente": "CorrienteConfig",
};

const handleCheckboxChange = (plan, event) => {
    const isChecked = event.target.checked;
    let updatedPlans = [...selectedPlans.value];

    if (isChecked) {
        updatedPlans.push(plan);
    } else {
        updatedPlans = updatedPlans.filter((p) => p !== plan);
        // Limpiar valores al deseleccionar
        delete selectedValues.value[plan];
        delete minValues.value[plan];
        delete maxValues.value[plan];
        delete graceMonths.value[plan];
        delete graceMonthsEnabled.value[plan];
        delete graceMinValues.value[plan];
        delete graceMaxValues.value[plan];
    }

    selectedPlans.value = updatedPlans;
};

const updateSelectedValues = (plan, value) => {
    selectedValues.value = { ...selectedValues.value, [plan]: value };
};

const updateMinValues = (plan, value) => {
    minValues.value = { ...minValues.value, [plan]: value || 1 };
};

const updateMaxValues = (plan, value) => {
    maxValues.value = { ...maxValues.value, [plan]: value || 999999 };
};

const updateGraceMonths = (plan, index, value) => {
    if (!graceMonths.value[plan]) {
        graceMonths.value[plan] = [];
    }
    graceMonths.value[plan][index] = value;
};

const updateGraceMinValues = (plan, index, value) => {
    if (!graceMinValues.value[plan]) {
        graceMinValues.value[plan] = [];
    }
    graceMinValues.value[plan][index] = value || 1;
};

const updateGraceMaxValues = (plan, index, value) => {
    if (!graceMaxValues.value[plan]) {
        graceMaxValues.value[plan] = [];
    }
    graceMaxValues.value[plan][index] = value || 999999;
};

const generateJSON = () => {
    const result = { include: [] };
    let codeCounter = 1;

    selectedPlans.value.forEach((plan) => {
        const letter = planToLetterMap[plan];

        if (plan === 'Corriente') {
            result.include.push({
                code: "0",
                groupCode: "C",
                type: "00",
                installments: ["0"]
            });
        } else if (plan === "Diferido Sin interes especial") {
            const installments = selectedValues.value[plan]?.split(',') || [];
            result.include.push({
                code: "0",
                groupCode: "X",
                type: "A",
                installments: installments,
                behaviors: [{
                    start: installments[0],
                    end: installments.at(-1),
                    settings: { amount: { min: minValues.value[plan] || 1, max: maxValues.value[plan] || 999999 } }
                }]
            });
        } else {
            const installments = selectedValues.value[plan]?.split(',') || [];
            const planData = {
                code: "0",
                groupCode: letter,
                type: plan === "Diferido Propio (Con interes)" ? "02" : "03",
                installments: installments,
                behaviors: [
                    {
                        end: installments.at(-1),
                        start: installments[0],
                        settings: {
                            amount: {
                                max: maxValues.value[plan] || 999999,
                                min: minValues.value[plan] || 1
                            }
                        }
                    }
                ]
            };

            result.include.push(planData);

            if (graceMonthsEnabled.value[plan]) {
                graceMonths.value[plan].forEach((monthValue, index) => {
                    if (monthValue) {
                        const installmentsArray = monthValue.split(',').map(item => item.trim());
                        const graceGroupCode = plan === "Diferido corriente (Sin interes)" ? "D" : "P";
                        const graceType = plan === "Diferido corriente (Sin interes)" ? "09" : "07";

                        result.include.push({
                            code: codeCounter.toString(),
                            groupCode: graceGroupCode,
                            type: graceType,
                            installments: installmentsArray,
                            behaviors: [
                                {
                                    end: installmentsArray.at(-1),
                                    start: installmentsArray[0],
                                    settings: {
                                        amount: {
                                            max: graceMaxValues.value[plan]?.[index] || 999999,
                                            min: graceMinValues.value[plan]?.[index] || 1
                                        }
                                    }
                                }
                            ]
                        });

                        codeCounter++;
                    }
                });
            }
        }
    });

    jsonData.value = result;
    jsonFormatted.value = JSON.stringify(result, null, 2);
    jsonCompact.value = JSON.stringify(result);
    emit('update:json', result);
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => alert('JSON copiado al portapapeles'))
        .catch((err) => console.error('Error al copiar:', err));
};
</script>