<template>
    <div class="mt-6">
        <div class="p-6 border border-gray-300 rounded-xl shadow-2xl bg-white">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Configuración de créditos para Datafast:</h3>
            <div class="grid grid-cols-1 gap-6">
                <!-- Sección de Planes Principales -->
                <div v-for="plan in datafastPlans" :key="plan" class="flex flex-col space-y-2">
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
                                placeholder="Ej:10" />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                            <input type="number" :value="maxValues[plan]"
                                @input="updateMaxValues(plan, $event.target.value)"
                                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ej: 999999" />
                        </div>
                    </div>
                </div>

                <!-- Sección de Meses de Gracia -->
                <div v-for="plan in graceEligiblePlans" :key="plan + '-grace'" class="mt-6 border-t pt-4">
                    <h4 class="font-bold text-gray-700 mb-2">Configuración de Meses de Gracia para {{ plan }}</h4>

                    <label class="flex items-center space-x-2 mb-3">
                        <input type="checkbox" v-model="graceMonthsEnabled[plan]"
                            @change="handleGraceCheckboxChange(plan, $event)" />
                        <span class="text-sm font-bold">Habilitar meses de gracia</span>
                    </label>

                    <div v-if="graceMonthsEnabled[plan]" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div class="flex flex-col space-y-7">
                            <div v-for="(month, index) in [1, 2, 3]" :key="index" class="flex flex-row gap-6">
                                <!-- Input del Mes -->
                                <div class="flex-1">
                                    <input type="text" v-model="graceMonths[plan][index]"
                                        @input="cleanGraceMonthsInput(plan, index, $event.target.value)"
                                        class="p-2 border border-gray-300 rounded-lg w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        :placeholder="`Diferido ${month} mes de gracia`" />
                                </div>
                                <!-- Input del Monto Mínimo -->
                                <div class="flex-1">
                                    <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                                    <input type="number" v-model="graceMinValues[plan][index]"
                                        class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Ej: 10" />
                                </div>
                                <!-- Input del Monto Máximo -->
                                <div class="flex-1">
                                    <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                                    <input type="number" v-model="graceMaxValues[plan][index]"
                                        class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Ej: 999999" />
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
import { ref, computed } from 'vue';

const props = defineProps({
    datafastPlans: { type: Array, required: true, default: () => [] }
});

const emit = defineEmits(['update:json']);

// Planes elegibles para meses de gracia
const graceEligiblePlans = [
    "Diferido Propio (Con interes)",
    "Diferido corriente (Sin interes)"
];

// Estado para planes principales
const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});

// Estado para meses de gracia 
const graceMonths = ref({
    "Diferido Propio (Con interes)": ['', '', ''],
    "Diferido corriente (Sin interes)": ['', '', '']
});

const graceMonthsEnabled = ref({
    "Diferido Propio (Con interes)": false,
    "Diferido corriente (Sin interes)": false
});

const graceMinValues = ref({
    "Diferido Propio (Con interes)": ['', '', ''],
    "Diferido corriente (Sin interes)": ['', '', '']
});

const graceMaxValues = ref({
    "Diferido Propio (Con interes)": ['', '', ''],
    "Diferido corriente (Sin interes)": ['', '', '']
});

const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

const hasAtLeastOneValidPlan = computed(() => {
    // Validar planes principales
    const hasValidMainPlan = selectedPlans.value.some(plan => {
        if (plan === 'Corriente') return true;
        return selectedValues.value[plan] && selectedValues.value[plan].trim() !== '';
    });

    // Validar meses de gracia
    const hasValidGracePlan = Object.entries(graceMonthsEnabled.value).some(([plan, enabled]) => {
        if (!enabled) return false;
        return graceMonths.value[plan].some(month => month && month.trim() !== '');
    });

    return hasValidMainPlan || hasValidGracePlan;
});

const planToLetterMap = {
    "Diferido Propio (Con interes)": "P",
    "Diferido corriente (Sin interes)": "D",
    "Corriente": "CorrienteConfig",
};

const getGraceCodeFromIndex = (index) => {
    const codes = ['1', '2', '3'];
    return codes[index] || '0';
};

const handleCheckboxChange = (plan, event) => {
    const isChecked = event.target.checked;
    let updatedPlans = [...selectedPlans.value];

    if (isChecked) {
        updatedPlans.push(plan);
    } else {
        updatedPlans = updatedPlans.filter((p) => p !== plan);
        // Limpiar valores al deseleccionar planes principales
        delete minValues.value[plan];
        delete maxValues.value[plan];
    }

    selectedPlans.value = updatedPlans;
};

// Cambios en el checkbox de meses de gracia
const handleGraceCheckboxChange = (plan, event) => {
    const isChecked = event.target.checked;

    if (!isChecked) {
        // Limpiar todos los inputs asociados a este plan
        graceMonths.value[plan] = ['', '', ''];
        graceMinValues.value[plan] = ['', '', ''];
        graceMaxValues.value[plan] = ['', '', ''];
    }

    graceMonthsEnabled.value[plan] = isChecked;
};

const updateSelectedValues = (plan, value) => {
    selectedValues.value = {
        ...selectedValues.value,
        [plan]: value.replace(/[^0-9,]/g, '')
    };
};

const updateMinValues = (plan, value) => {
    minValues.value = { ...minValues.value, [plan]: value || 10 };
};

const updateMaxValues = (plan, value) => {
    maxValues.value = { ...maxValues.value, [plan]: value || 999999 };
};

const cleanGraceMonthsInput = (plan, index, value) => {
    graceMonths.value[plan][index] = value.replace(/[^0-9,]/g, '');
};

const generateJSON = () => {
    const result = { include: [] };

    // Procesar planes principales
    for (const plan of selectedPlans.value) {
        if (plan === 'Corriente') {
            result.include.push({
                code: "0",
                groupCode: "C",
                type: "00",
                installments: ["0"]
            });
            continue;
        }

        const minVal = parseFloat(minValues.value[plan]) || 10;
        const maxVal = parseFloat(maxValues.value[plan]) || 999999;

        if (minVal > maxVal) {
            confirm(`❌ En el plan "${plan}" el valor mínimo no puede ser mayor que el valor máximo. ❌`);
            return;
        }

        const installments = selectedValues.value[plan]?.split(',').filter(Boolean) || [];
        if (installments.length === 0) continue;

        result.include.push({
            code: "0",
            groupCode: planToLetterMap[plan],
            type: plan === "Diferido Propio (Con interes)" ? "02" : "03",
            installments: installments,
            behaviors: [
                {
                    end: Math.max(...installments.map(Number)),
                    start: Math.min(...installments.map(Number)),
                    settings: {
                        amount: {
                            max: maxVal,
                            min: minVal
                        }
                    }
                }
            ]
        });
    }

    // Procesar meses de gracia
    for (const plan of graceEligiblePlans) {
        if (!graceMonthsEnabled.value[plan]) continue;

        for (let index = 0; index < 3; index++) {
            const monthValue = graceMonths.value[plan][index];
            if (!monthValue || monthValue.trim() === '') continue;

            const graceMin = parseFloat(graceMinValues.value[plan][index]) || 10;
            const graceMax = parseFloat(graceMaxValues.value[plan][index]) || 999999;

            const installmentsArray = monthValue.split(',').filter(Boolean);
            const graceGroupCode = plan === "Diferido corriente (Sin interes)" ? "D" : "P";
            const graceType = plan === "Diferido corriente (Sin interes)" ? "09" : "07";

            if (graceMin > graceMax) {
                confirm(`❌ En ${plan} - mes de gracia ${index + 1}: el mínimo no puede ser mayor que el máximo. ❌`);
                return;
            }


            result.include.push({
                code: getGraceCodeFromIndex(index),
                groupCode: graceGroupCode,
                type: graceType,
                installments: installmentsArray,
                behaviors: [
                    {
                        end: Math.max(...installmentsArray.map(Number)),
                        start: Math.min(...installmentsArray.map(Number)),
                        settings: {
                            amount: {
                                max: graceMax,
                                min: graceMin
                            }
                        }
                    }
                ]
            });
        }
    }

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

<style scoped>
.scrollbar-custom::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>