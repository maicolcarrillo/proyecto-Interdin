<template>
  <div class="bg-white p-6 rounded-lg shadow mt-6">
    <button @click="generateJSON" :disabled="!hasAtLeastOneValidPlan"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
      Generar JSON
    </button>

    <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px]">
      <!-- Columna Izquierda - JSON Formateado -->
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

      <!-- Columna Derecha - JSON Compacto -->
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
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  selectedPlans: Array,
  selectedValues: Object,
  minValues: Object,
  maxValues: Object,
  planToLetterMap: Object
});

// Verifica si AL MENOS UN plan tiene un mes válido
const hasAtLeastOneValidPlan = computed(() => {
  return props.selectedPlans.some(plan => {
    const value = props.selectedValues[plan];
    return value && (typeof value === 'string' ? value.trim() !== '' : true);
  });
});

const jsonFormatted = ref(null);
const jsonCompact = ref(null);
const jsonData = ref(null);

const planToIdMap = {
  "Plan Pagos Normal": 3,
  "Plan Pago Especial": 3,
  "Diferido Propio (Con interes)": 3,
  "Diferido Corriente (Sin interes)": 3,
  "Corriente": 1,
  "Diferido Plus (Mixto)": 3,
  "Diferido Preferente": 3
};

function generateJSON() {
  const result = {
    C: {}, D: {}, L: {}, M: {}, N: {}, P: {}, X: {}
  };

  let hasError = false; // 🔥 Bandera para saber si hubo un error

  props.selectedPlans.forEach(plan => {
    const category = props.planToLetterMap[plan];
    const id = planToIdMap[plan];

    if (category && id) {
      let values = props.selectedValues[plan];
      if (!Array.isArray(values)) {
        values = [values];
      }

      for (const value of values) {
        if (value) {
          let min = props.minValues[plan] ? Number(props.minValues[plan]) : 10;
          let max = props.maxValues[plan] ? Number(props.maxValues[plan]) : 9999999;

          if (min > max) {
            confirm(`❌ En el plan "${plan}" el valor mínimo no puede ser mayor que el valor máximo. ❌`);
            hasError = true; // 🔥 Marcamos que hay error
            break; // 
          }

          result[category][value] = {
            minimum: min.toString(),
            maximum: max.toString()
          };
        }
      }
    }
  });

  if (hasError) {
    return; // 🚫 Si hubo error 
  }

  // 🔵 Si no hay error
  Object.keys(result).forEach(category => {
    for (let i = 1; i <= 61; i++) {
      if (!result[category][i]) {
        result[category][i] = { remove: true };
      }
    }
  });

  jsonData.value = result;
  jsonFormatted.value = JSON.stringify(jsonData.value, null, 2);
  jsonCompact.value = JSON.stringify(jsonData.value);
}


function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('JSON copiado al portapapeles'))
    .catch(err => console.error('Error al copiar:', err));
}
</script>

<style>
.scrollbar-custom::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
  border: 2px solid #1f2937;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

code {
  line-height: 1.4;
  display: inline-block;
  min-width: 100%;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>