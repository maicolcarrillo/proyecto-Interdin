<template>
  <!-- Menú de navegación -->
  <div class="flex w-full md:max-w-xl mx-auto my-4 rounded-lg shadow-lg overflow-hidden">
    <a href="#" @click.prevent="showDevelopmentAlert" aria-current="false"
      class="group w-full flex justify-center font-medium px-5 py-2 border bg-white text-gray-800 border-gray-200 transition-all duration-1000 ease-in-out hover:bg-black hover:text-white">
      Bines
    </a>
    <!-- <a href="#" aria-current="false"
      class="group w-full flex items-center gap-x-2 justify-center font-medium px-5 py-2 border bg-white text-gray-800 border-gray-200 transition-all duration-700 ease-in-out hover:bg-black hover:text-white">
      Forwording
      <svg class="w-5 h-5 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    </a> -->
  </div>

  <!-- Contenido principal -->
  <div class="bg-gray-100 min-h-screen p-4">
    <div class="container mx-auto pt-12 pb-20">
      <!-- Título y descripción -->
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
        <div v-for="network in networks" :key="network.name" @click="selectMessage(network.name)"
          class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-1000 ease-in-out hover:scale-105 hover:bg-black">

          <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">{{ network.name }}</h2>
          <p class="text-gray-700 group-hover:text-white">{{ network.description }}</p>

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
        <MedianetConfig :medianet-plans="medianetPlans" :selected-plans="selectedPlans"
          :selected-values="selectedValues" :min-values="minValues" :max-values="maxValues"
          @update:selectedPlans="selectedPlans = $event" @update:selectedValues="selectedValues = $event"
          @update:minValues="minValues = $event" @update:maxValues="maxValues = $event" />
      </div>

      <!-- Configuración para Datafast -->
      <div v-if="selectedMessage.includes('Datafast')" class="mt-6">
        <DatafashConfig :medianet-plans="medianetPlans" :selected-plans="selectedPlans"
          :selected-values="selectedValues" :min-values="minValues" :max-values="maxValues"
          @update:selectedPlans="selectedPlans = $event" @update:selectedValues="selectedValues = $event"
          @update:minValues="minValues = $event" @update:maxValues="maxValues = $event" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CreditConfigGenerator from './CreditConfigGenerator.vue';
import MedianetConfig from './MedianetConfig.vue';
import DatafashConfig from './DatafashConfig.vue';
import AustroConfig from './AustroConfig.vue';



//Bines
import Bines from './BinesConfig.vue';

// Mapeo de planes a letras
const planToLetterMap = {
  "Plan pago especial": "X",
  "Diferido Propio (Con interes)": "P",
  "Diferido corriente (Sin interes)": "D",
  "Corriente": "C",
  "Diferido Plus": "M",
  "Diferido preferente": "L",
};

const plans = Object.keys(planToLetterMap);
const medianetPlans = ["Diferido Propio (Con interes)", "Diferido corriente (Sin interes)", "Corriente"];

const networks = [
  { name: 'Interdin', description: 'Procesar datos con Interdin.' },
  { name: 'Medianet', description: 'Procesar datos con Medianet.' },
  { name: 'Datafast', description: 'Procesar datos con Datafast.' },
  { name: 'Austro', description: 'Procesar datos con Austro.' },
];

// Variables reactivas
const selectedMessage = ref("");
const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});
const hasCorriente = ref(false);

// Observadores
watch(selectedPlans, (newPlans) => {
  plans.forEach((plan) => {
    if (!newPlans.includes(plan)) {
      delete selectedValues.value[plan];
      delete minValues.value[plan];
      delete maxValues.value[plan];
    }
  });
});

watch(hasCorriente, (newVal) => {
  if (newVal && selectedMessage.value.includes('Medianet')) {
    if (!selectedPlans.value.includes('Corriente')) {
      selectedPlans.value.push('Corriente');
    }
  } else {
    selectedPlans.value = selectedPlans.value.filter((plan) => plan !== 'Corriente');
  }
});

// Funciones
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

const updateSelectedValues = (plan, value) => {
  if (value.includes(',')) {
    selectedValues.value[plan] = value.split(',').map((v) => v.trim());
  } else {
    selectedValues.value[plan] = value;
  }
};

//alerta Bines
const showDevelopmentAlert = () => {
  alert("Función en desarrollo 👉​⚠️​");
};
</script>