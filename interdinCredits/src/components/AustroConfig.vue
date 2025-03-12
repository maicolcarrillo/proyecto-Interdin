<template>
    <div class="mt-6">
        <div class="p-4 border rounded bg-gray-100">
            <h3 class="text-lg font-bold mb-4">Configuración de créditos para Austro:</h3>
            <div class="grid grid-cols-1 gap-4">
                <div v-for="plan in medianetPlans" :key="plan" class="flex flex-col space-y-2">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" :checked="selectedPlans.includes(plan)"
                            @change="handleCheckboxChange(plan, $event)" />
                        <span class="font-medium">{{ plan }}</span>
                    </label>
                    <div v-if="selectedPlans.includes(plan) && plan !== 'Corriente'"
                        class="grid grid-cols-3 gap-4 ml-6">
                        <input type="text" :value="selectedValues[plan]"
                            @input="updateSelectedValues(plan, $event.target.value)" class="p-2 border rounded w-full"
                            placeholder="En meses" />
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                            <input type="number" :value="minValues[plan]"
                                @input="updateMinValues(plan, $event.target.value)" class="p-2 border rounded w-full"
                                placeholder="Ej:1" />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                            <input type="number" :value="maxValues[plan]"
                                @input="updateMaxValues(plan, $event.target.value)" class="p-2 border rounded w-full"
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
                        <div v-if="graceMonthsEnabled[plan]" class="grid grid-cols-3 gap-2 mt-2">
                            <input v-for="month in [1, 2, 3]" :key="month" type="text"
                                :value="graceMonths[plan]?.[month - 1] || ''"
                                @input="updateGraceMonths(plan, month - 1, $event.target.value)"
                                class="p-2 border rounded w-full" :placeholder="`Diferido ${month} mes de gracia`" />
                        </div>
                    </div>

                </div>
            </div>
            <button @click="generateJSON" :disabled="selectedPlans.length === 0"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
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
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    medianetPlans: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['update:json']);

const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});
const graceMonths = ref({});
const graceMonthsEnabled = ref({});

const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

const planToLetterMap = {
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
    // Asegurar que el plan tenga un array válido
    if (!graceMonths.value[plan]) {
        graceMonths.value[plan] = [];
    }

    // Actualizar el valor ingresado en la posición correcta
    graceMonths.value[plan][index] = value;
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
        } else {
            let installments = selectedValues.value[plan]?.split(',') || [];
            let planData = {
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

            // Agregar meses de gracia para "Diferido Propio (Con interés)"
            if (plan === "Diferido Propio (Con interes)" && graceMonthsEnabled.value[plan]) {
                graceMonths.value[plan]?.forEach((graceMonth, index) => {
                    if (graceMonth) {
                        result.include.push({
                            code: codeCounter.toString(),
                            groupCode: "P",
                            type: "07",
                            installments: [installments[index], (parseInt(installments[index]) + parseInt(graceMonth)).toString()]
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
