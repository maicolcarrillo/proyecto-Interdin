<template>
  <div class="mt-6">
    <div class="p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-bold mb-4">Configuración de créditos para Medianet:</h3>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="plan in medianetPlans" :key="plan" class="flex flex-col space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" :checked="selectedPlans.includes(plan)"
              @change="handleCheckboxChange(plan, $event)" />
            <span class="font-medium">{{ plan }}</span>
          </label>
          <div v-if="selectedPlans.includes(plan) && plan !== 'Corriente'" class="grid grid-cols-3 gap-4 ml-6">
            <input type="text" :value="selectedValues[plan]" @input="updateSelectedValues(plan, $event.target.value)"
              class="p-2 border rounded w-full" placeholder="En meses" />
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
              <input type="number" :value="minValues[plan]" @input="updateMinValues(plan, $event.target.value)"
                class="p-2 border rounded w-full" placeholder="Ej:1" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
              <input type="number" :value="maxValues[plan]" @input="updateMaxValues(plan, $event.target.value)"
                class="p-2 border rounded w-full" placeholder="Ej: 999999" />
            </div>
          </div>
        </div>
      </div>
      <button @click="generateJSON"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 transition-colors">
        Generar JSON
      </button>
      <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px] mt-6">
        <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-300 text-sm">JSON Formateado</span>
            <button @click="copyToClipboard(jsonFormatted)" class="text-gray-400 hover:text-white transition-colors">
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
            <button @click="copyToClipboard(jsonCompact)" class="text-gray-400 hover:text-white transition-colors">
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

const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

const planToGroupMap = {
  "Diferido Propio (Con interes)": { groupCode: "P", type: "01" },
  "Diferido corriente (Sin interes)": { groupCode: "D", type: "04" },
  "Corriente": { groupCode: "C", type: "00" },
};

const handleCheckboxChange = (plan, event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    selectedPlans.value.push(plan);
  } else {
    selectedPlans.value = selectedPlans.value.filter((p) => p !== plan);
  }
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

const generateJSON = () => {
  const result = { include: [] };

  selectedPlans.value.forEach((plan) => {
    const { groupCode, type } = planToGroupMap[plan];

    if (plan === 'Corriente') {
      result.include.push({
        code: "0",
        groupCode,
        type,
        installments: ["0"]
      });
    } else {
      result.include.push({
        code: "0",
        groupCode,
        type,
        installments: (selectedValues.value[plan] || "").split(",").map(v => v.trim()),
        minAmount: minValues.value[plan] || 1,
        maxAmount: maxValues.value[plan] || 999999,
      });
    }
  });

  jsonData.value = result;
  jsonFormatted.value = JSON.stringify(result, null, 2);
  jsonCompact.value = JSON.stringify(result);
  emit('update:json', result);
};
</script>
