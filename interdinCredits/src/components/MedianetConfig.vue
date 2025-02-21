<template>
  <div class="mt-6">
    <div class="p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-bold mb-4">Configuración de créditos para Medianet:</h3>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="plan in medianetPlans" :key="plan" class="flex flex-col space-y-2">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="selectedPlans.includes(plan)"
              @change="handleCheckboxChange(plan, $event)"
            />
            <span class="font-medium">{{ plan }}</span>
          </label>
          <!-- Campos adicionales solo para planes que no son "Corriente" -->
          <div v-if="selectedPlans.includes(plan) && plan !== 'Corriente'" class="grid grid-cols-3 gap-4 ml-6">
            <input
              type="text"
              :value="selectedValues[plan]"
              @input="updateSelectedValues(plan, $event.target.value)"
              class="p-2 border rounded w-full"
              placeholder="En meses"
            />
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
              <input
                type="number"
                :value="minValues[plan]"
                @input="updateMinValues(plan, $event.target.value)"
                class="p-2 border rounded w-full"
                placeholder="Ej:1"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
              <input
                type="number"
                :value="maxValues[plan]"
                @input="updateMaxValues(plan, $event.target.value)"
                class="p-2 border rounded w-full"
                placeholder="Ej: 999999"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botón para generar JSON -->
      <button
        @click="generateJSON"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 transition-colors"
      >
        Generar JSON
      </button>

      <!-- Mostrar JSON en dos columnas -->
      <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px] mt-6">
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
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Props para recibir datos del componente padre
const props = defineProps({
  medianetPlans: {
    type: Array,
    required: true,
  },
});

// Emits para enviar el JSON generado al componente padre
const emit = defineEmits(['update:json']);

// Variables reactivas para los planes seleccionados y valores
const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});

// Variables para el JSON generado
const jsonData = ref(null);
const jsonFormatted = ref('');
const jsonCompact = ref('');

// Función para manejar cambios en los checkboxes
const handleCheckboxChange = (plan, event) => {
  const isChecked = event.target.checked;
  let updatedPlans = [...selectedPlans.value];

  if (isChecked) {
    updatedPlans.push(plan); // Agregar el plan si está seleccionado
  } else {
    updatedPlans = updatedPlans.filter((p) => p !== plan); // Eliminar el plan si no está seleccionado
  }

  selectedPlans.value = updatedPlans;
};

// Función para actualizar los valores seleccionados (meses)
const updateSelectedValues = (plan, value) => {
  selectedValues.value = { ...selectedValues.value, [plan]: value };
};

// Función para actualizar los montos mínimos
const updateMinValues = (plan, value) => {
  minValues.value = { ...minValues.value, [plan]: value || 1 }; // Valor por defecto: 1
};

// Función para actualizar los montos máximos
const updateMaxValues = (plan, value) => {
  maxValues.value = { ...maxValues.value, [plan]: value || 999999 }; // Valor por defecto: 999999
};

// Función para generar el JSON
const generateJSON = () => {
  const result = {};

  selectedPlans.value.forEach((plan) => {
    if (plan === 'Corriente') {
      // Si el plan es "Corriente", simplemente agregar true
      result[plan] = true;
    } else {
      // Para otros planes, agregar los valores ingresados (con valores por defecto)
      result[plan] = {
        meses: selectedValues.value[plan] || '',
        montoMinimo: minValues.value[plan] || 1, // Valor por defecto: 1
        montoMaximo: maxValues.value[plan] || 999999, // Valor por defecto: 999999
      };
    }
  });

  // Asignar el resultado a las variables reactivas
  jsonData.value = result;
  jsonFormatted.value = JSON.stringify(result, null, 2); // JSON formateado
  jsonCompact.value = JSON.stringify(result); // JSON compacto

  // Emitir el JSON generado al componente padre
  emit('update:json', result);
};

// Función para copiar texto al portapapeles
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => alert('JSON copiado al portapapeles'))
    .catch((err) => console.error('Error al copiar:', err));
};
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