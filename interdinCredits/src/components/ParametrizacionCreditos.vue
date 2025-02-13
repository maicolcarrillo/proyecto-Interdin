<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <div class="container mx-auto pt-12 pb-20">
      <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
        Bienvenido a parametrización de tipo de créditos Ecuador
      </h1>
      <p class="text-gray-700 text-lg text-center mb-12">
        Debes seleccionar la red procesadora correspondiente
      </p>

      <!-- Mensaje de red seleccionada -->
      <p v-if="selectedMessage" class="text-center text-lg font-semibold text-blue-600 mb-6">
        {{ selectedMessage }}
      </p>

      <!-- Tarjetas de redes procesadoras -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="network in networks" :key="network.name"
          @click="selectMessage(network.name)"
          class="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-200 transition">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ network.name }}</h2>
          <p class="text-gray-700">{{ network.description }}</p>
        </div>
      </div>

      <!-- Configuración para Interdin -->
      <div v-if="selectedMessage.includes('Interdin')" class="mt-6">
        <div class="p-4 border rounded bg-gray-100">
          <h3 class="text-lg font-bold mb-4">Configuración de créditos:</h3>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="plan in plans" :key="plan" class="flex flex-col space-y-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedPlans" :value="plan" />
                <span class="font-medium">{{ plan }}</span>
              </label>
              <div v-if="selectedPlans.includes(plan)" class="grid grid-cols-3 gap-4 ml-6">
                <input type="text" v-model="selectedValues[plan]"
                  @input="updateSelectedValues(plan, $event.target.value)" class="p-2 border rounded w-full"
                  placeholder="En meses" />
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Mínimo Para Mostrar el Tipo de Crédito</label>
                  <input type="number" v-model="minValues[plan]" class="p-2 border rounded w-full" placeholder="Ej:1" />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Máximo Para Mostrar el Tipo de Crédito</label>
                  <input type="number" v-model="maxValues[plan]" class="p-2 border rounded w-full"
                    placeholder="Ej: 9999999" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreditConfigGenerator :selected-plans="selectedPlans" :selected-values="selectedValues" :min-values="minValues"
          :max-values="maxValues" :plan-to-letter-map="planToLetterMap" class="mt-6" />
      </div>

      <!-- Configuración para Medianet -->
      <div v-if="selectedMessage.includes('Medianet')" class="mt-6">
        <div class="p-4 border rounded bg-gray-100">
          <h3 class="text-lg font-bold mb-4">Configuración de créditos para Medianet:</h3>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="plan in medianetPlans" :key="plan" class="flex flex-col space-y-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="selectedPlans" :value="plan" />
                <span class="font-medium">{{ plan }}</span>
              </label>
              <div v-if="selectedPlans.includes(plan)" class="grid grid-cols-3 gap-4 ml-6">
                <input type="text" v-model="selectedValues[plan]"
                  @input="updateSelectedValues(plan, $event.target.value)" class="p-2 border rounded w-full"
                  placeholder="En meses" />
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                  <input type="number" v-model="minValues[plan]" class="p-2 border rounded w-full" placeholder="Ej:1" />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                  <input type="number" v-model="maxValues[plan]" class="p-2 border rounded w-full"
                    placeholder="Ej: 9999999" />
                </div>
              </div>
            </div>

            <!-- Configuración para Data  -->
            <div v-if="selectedMessage.includes('Datafast')" class="mt-6">
            </div>

            <!-- Checkbox para tipo de crédito corriente -->
            <label class="flex items-center space-x-2 mt-4">
              <input type="checkbox" v-model="hasCorriente" />
              <span class="font-medium">Incluir tipo de crédito Corriente</span>
            </label>
          </div>
        </div>
        <CreditConfigGenerator :selected-plans="selectedPlans" :selected-values="selectedValues" :min-values="minValues"
          :max-values="maxValues" :plan-to-letter-map="planToLetterMap" class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CreditConfigGenerator from './CreditConfigGenerator.vue';
//import MedianetConfig from './MedianetConfig.vue';


// Mapeo de planes a letras
const planToLetterMap = {
  "Plan pago especial": "X",
  "Diferido Propio (Con interes)": "P",
  "Diferido corriente (Sin interes)": "D",
  "Corriente": "C",
  "Diferido Plus": "M",
  "Diferido preferente": "L"
};

const plans = Object.keys(planToLetterMap);
const medianetPlans = ["Diferido Propio (Con interes)", "Diferido corriente (Sin interes)"];

const networks = [
  { name: 'Interdin', description: 'Procesar datos con Interdin.' },
  { name: 'Medianet', description: 'Procesar datos con Medianet.' },
  { name: 'Datafast', description: 'Procesar datos con Datafast.' },
  { name: 'Austro', description: 'Procesar datos con Austro.' }
];

// Variables reactivas
const selectedMessage = ref("");
const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});
const hasCorriente = ref(false);

// Observador para limpiar datos de planes no seleccionados
watch(selectedPlans, (newPlans) => {
  plans.forEach(plan => {
    if (!newPlans.includes(plan)) {
      delete selectedValues.value[plan];
      delete minValues.value[plan];
      delete maxValues.value[plan];
    }
  });
});

// Observador para incluir/excluir Corriente automáticamente en Medianet
watch(hasCorriente, (newVal) => {
  if (newVal && selectedMessage.value.includes('Medianet')) {
    if (!selectedPlans.value.includes('Corriente')) {
      selectedPlans.value.push('Corriente');
    }
  } else {
    selectedPlans.value = selectedPlans.value.filter(plan => plan !== 'Corriente');
  }
});

// Función para seleccionar red procesadora
const selectMessage = (message) => {
  selectedMessage.value = `Has seleccionado ${message}.`;
  if (message !== "Interdin" && message !== "Medianet") {
    selectedPlans.value = [];
    selectedValues.value = {};
    minValues.value = {};
    maxValues.value = {};
  }
  if (message !== "Medianet") {
    hasCorriente.value = false;
  }
};

// Función para actualizar valores seleccionados
const updateSelectedValues = (plan, value) => {
  if (value.includes(',')) {
    selectedValues.value[plan] = value.split(',').map(v => v.trim());
  } else {
    selectedValues.value[plan] = value;
  }
};
</script>
