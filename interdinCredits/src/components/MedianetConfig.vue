<template>
  <div class="mt-6">
    <div class="p-6 border border-gray-300 rounded-xl shadow-2xl bg-white">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Configuración de créditos para Medianet:</h3>
      <div class="grid grid-cols-1 gap-6">
        <div v-for="plan in medianetPlans" :key="plan" class="flex flex-col space-y-2">
          <label class="flex items-center space-x-3">
            <input type="checkbox" :checked="selectedPlans.includes(plan)" @change="handleCheckboxChange(plan, $event)"
              class="w-5 h-5 text-blue-500 accent-blue-600" />
            <span class="font-medium text-gray-700">{{ plan }}</span>
          </label>

          <div v-if="selectedPlans.includes(plan)"
            class="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input v-if="plan !== 'Corriente'" type="text" :value="selectedValues[plan]"
              @input="updateSelectedValues(plan, $event.target.value)"
              class="p-2 mt-5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="En meses" />
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
              <input type="number" :value="minValues[plan]" @input="updateMinValues(plan, $event.target.value)"
                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: 10" min="0" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
              <input type="number" :value="maxValues[plan]" @input="updateMaxValues(plan, $event.target.value)"
                class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: 999999" min="0" />
            </div>
          </div>
        </div>
      </div>

      <button @click="generateJSON" :disabled="!hasAtLeastOneValidPlan"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
        Generar JSON
      </button>

      <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px] mt-6">
        <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col shadow-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-300 text-sm">JSON Formateado</span>
            <button @click="copyToClipboard(jsonFormatted)" class="text-gray-400 hover:text-white transition-colors"
              aria-label="Copiar JSON formateado">
              📝 Copiar
            </button>
          </div>
          <pre class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom">
            <code class="bg-gray-800/50 p-2 rounded inline-block min-w-full">{{ jsonFormatted }}</code>
          </pre>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col shadow-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-300 text-sm">JSON Compacto</span>
            <button @click="copyToClipboard(jsonCompact)" class="text-gray-400 hover:text-white transition-colors"
              aria-label="Copiar JSON compacto">
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

// Nueva validación computada
const hasAtLeastOneValidPlan = computed(() => {
  return selectedPlans.value.some(plan => {
    // El plan "Corriente" no necesita meses
    if (plan === 'Corriente') return true;

    const value = selectedValues.value[plan];
    return value && (typeof value === 'string' ? value.trim() !== '' : true);
  });
});

const planToLetterMap = {
  "Plan Pagos Mes a Mes Sin Intereses": "P",
  "Diferido Con interes": "P",
  "Diferido Sin interes": "D",
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
  }

  selectedPlans.value = updatedPlans;
};

const updateSelectedValues = (plan, value) => {
  const cleanedValue = value.replace(/[^0-9,]/g, ''); // Permitir solo números y comas
  selectedValues.value = { ...selectedValues.value, [plan]: cleanedValue };
};

const updateMinValues = (plan, value) => {
  minValues.value = { ...minValues.value, [plan]: value || 10 };
};

const updateMaxValues = (plan, value) => {
  maxValues.value = { ...maxValues.value, [plan]: value || 999999 };
};

const generateJSON = () => {
  // Validación de los valores minimum y maximum al generar el JSON
  for (const plan of selectedPlans.value) {
    const minValue = minValues.value[plan];
    const maxValue = maxValues.value[plan];

    if (minValue && maxValue && parseFloat(minValue) > parseFloat(maxValue)) {
      confirm(` ❌ En el plan "${plan}" el valor mínimo no puede ser mayor que el valor máximo. ❌`);
      return;
    }
  }

  const result = { include: [] };

  if (selectedPlans.value.includes("Corriente")) {
    result.include.push({
      code: "0",
      groupCode: "C",
      type: "00",
      installments: ["0"],
      behaviors: [
        {
          end: 0,
          start: 0,
          settings: {
            amount: {
              max: parseFloat(maxValues.value["Corriente"] ?? 999999),
              min: parseFloat(minValues.value["Corriente"] ?? 10)
            }
          }
        }
      ]
    });
  }

  selectedPlans.value
    .filter(plan => plan !== "Corriente")
    .forEach((plan) => {
      const installments = selectedValues.value[plan]?.split(',') ?? [];

      let letter = planToLetterMap[plan];
      let type;

      if (plan === "Plan Pagos Mes a Mes Sin Intereses") {
        type = "06";
        letter = "D";
      } else {
        type = plan === "Diferido Con interes" ? "01" : "04";
      }

      const planObject = {
        code: "0",
        groupCode: letter,
        type,
        installments,
        behaviors: [
          {
            end: Math.max(...installments.map(Number)),
            start: Math.min(...installments.map(Number)),
            settings: {
              amount: {
                max: parseFloat(maxValues.value[plan] ?? 999999),
                min: parseFloat(minValues.value[plan] ?? 10)
              }
            }
          }
        ]
      };

      result.include.push(planObject);
    });

  // Generar JSONs formateado y compacto
  jsonData.value = result;
  jsonFormatted.value = JSON.stringify(result, null, 2);
  jsonCompact.value = JSON.stringify(result);
  emit('update:json', result);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => alert('JSON copiado al portapeles'))
    .catch((err) => console.error('Error al copiar:', err));
};
</script>
