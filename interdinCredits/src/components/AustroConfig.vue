<template>
    <div class="mt-6">
        <div class="p-6 border border-gray-300 rounded-xl shadow-2xl bg-white">
            <h3 class="text-lg font-bold mb-4">Configuración de créditos para Austro:</h3>
            <div class="grid grid-cols-1 gap-4">
                <div v-for="plan in autroPlans" :key="plan" class="flex flex-col space-y-2">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" :checked="selectedPlans.includes(plan)"
                            @change="handleCheckboxChange(plan, $event)"
                            class="w-5 h-5 text-blue-500 accent-blue-600" />
                        <span class="font-medium">{{ plan }}</span>
                    </label>
                    <div v-if="selectedPlans.includes(plan) && plan !== 'Corriente'"
                        class="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <input type="text" v-model="selectedValues[plan]"
                            class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="En meses" />
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                            <input type="number" v-model="minValues[plan]"
                                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ej:1" />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                            <input type="number" v-model="maxValues[plan]"
                                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ej: 999999" />
                        </div>
                    </div>
                    <div v-if="selectedPlans.includes(plan) && ['Diferido Propio (Con interes)', 'Diferido corriente (Sin interes)'].includes(plan)"
                        class="ml-6">
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" v-model="graceMonthsEnabled[plan]" />
                            <span class="text-sm font-bold">Meses de gracia</span>
                        </label>
                        <div v-if="graceMonthsEnabled[plan]" class="grid grid-cols-3 gap-2 mt-2">
                            <input v-for="month in [1, 2, 3]" :key="month" type="text"
                                v-model="graceMonths[plan][month - 1]" class="p-2 border rounded w-full"
                                :placeholder="`Diferido ${month} mes de gracia`" />
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
                            class="text-gray-400 hover:text-white transition-colors">📝 Copiar</button>
                    </div>
                    <pre
                        class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom"><code class="bg-gray-800/50 p-2 rounded inline-block min-w-full">{{ jsonFormatted }}</code></pre>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-300 text-sm">JSON Compacto</span>
                        <button @click="copyToClipboard(jsonCompact)"
                            class="text-gray-400 hover:text-white transition-colors">📝 Copiar</button>
                    </div>
                    <pre
                        class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom"><code class="bg-gray-800/50 p-2 rounded">{{ jsonCompact }}</code></pre>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, defineProps, defineEmits } from 'vue';

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
const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

const planToLetterMap = {
    "Diferido Sin interes especial": "X",
    "Diferido Propio (Con interes)": "P",
    "Diferido corriente (Sin interes)": "D",
    "Corriente": "CorrienteConfig",
};

const handleCheckboxChange = (plan, event) => {
    selectedPlans.value = event.target.checked
        ? [...selectedPlans.value, plan]
        : selectedPlans.value.filter(p => p !== plan);
};

const generateJSON = () => {
    const result = { include: [] };
    let codeCounter = 1;

    selectedPlans.value.forEach((plan) => {
        const letter = planToLetterMap[plan];
        const installments = selectedValues.value[plan]?.split(',') || [];
        if (plan === 'Corriente') {
            result.include.push({ code: "0", groupCode: "C", type: "00", installments: ["0"] });
        } else if (plan === "Diferido Sin interes especial") {
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
        }

        else {
            result.include.push({
                code: "0",
                groupCode: letter,
                type: plan === "Diferido Propio (Con interes)" ? "02" : "03",
                installments: installments,
                behaviors: [{
                    start: installments[0],
                    end: installments.at(-1),
                    settings: { amount: { min: minValues.value[plan] || 1, max: maxValues.value[plan] || 999999 } }
                }]
            });

            if (graceMonthsEnabled.value[plan]) {
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
    navigator.clipboard.writeText(text).then(() => alert('JSON copiado al portapapeles'));
};
</script>
