<template>

  <!-- Botón de menú "Bines" -->

  <div class="w-full md:max-w-xl mx-auto my-6 relative">
    <!-- Botón -->
    <button @click.prevent="toggleBinesList"
      class="w-full bg-white text-gray-900 text-sm font-medium text-center rounded-md shadow-md py-3 px-6 flex items-center justify-center gap-2 transition duration-300 hover:bg-black hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black">
      Bines
      <svg :class="{ 'rotate-180': mostrarLista }" class="w-4 h-4 transition-transform duration-200" fill="none"
        stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>


    <!-- Lista desplegable de redes BIN -->
    <transition name="fade">
      <div v-if="mostrarLista"
        class="absolute left-0 right-0 z-10 bg-white rounded-md shadow-md border border-gray-200 mt-2 overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="(bin, index) in bines" :key="index" @click="abrirModal(bin.network)"
            class="px-6 py-3 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-black hover:text-white group">
            <div class="flex items-center justify-between">
              <span class="font-medium group-hover:text-white">{{ bin.network }}</span>
              <span class="text-sm group-hover:text-gray-300">{{ bin.description }}</span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>

  <!-- Componente Hijo: Modal JSON -->
  <BinesConfig :network="selectedNetwork" :visible="showModal" @close="showModal = false" />


  <!-- Contenido principal -->
  <div class="bg-gray-100 min-h-screen p-4">
    <div class="container mx-auto pt-12 pb-20">
      <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
        Bienvenido a parametrización de tipo de créditos Ecuador
      </h1>
      <p class="text-gray-700 text-lg text-center mb-12">
        Debes seleccionar la red procesadora correspondiente
      </p>

      <p v-if="selectedMessage" class="text-center text-lg font-semibold text-blue-600 mb-6">
        {{ selectedMessage }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="network in networks" :key="network.name" @click="selectMessage(network.name)"
          class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">

          <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">{{ network.name }}</h2>
          <p class="text-gray-700 group-hover:text-white">{{ network.description }}</p>

        </div>
      </div>

      <!-- Configuraciones por red -->
      <div v-if="selectedMessage.includes('Interdin')" class="mt-6">
        <div class="p-6 border border-gray-300 rounded-xl shadow-2xl bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Configuración de créditos:</h3>

          <div class="grid grid-cols-1 gap-6">
            <div v-for="plan in plans" :key="plan" class="flex flex-col space-y-4">
              <label class="flex items-center space-x-3">
                <input type="checkbox" v-model="selectedPlans" :value="plan"
                  class="w-5 h-5 text-blue-500 accent-blue-600" />
                <span class="font-medium text-gray-700">{{ plan }}</span>
              </label>

              <div v-if="selectedPlans.includes(plan)"
                class="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input type="text" v-model="selectedValues[plan]"
                  @input="updateSelectedValues(plan, $event.target.value)"
                  class="p-2 mt-5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="En meses" />

                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Mínimo</label>
                  <input type="number" v-model="minValues[plan]"
                    class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Ej: 1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monto Máximo</label>
                  <input type="number" v-model="maxValues[plan]"
                    class="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Ej: 9999999" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreditConfigGenerator :selected-plans="selectedPlans" :selected-values="selectedValues" :min-values="minValues"
          :max-values="maxValues" :plan-to-letter-map="planToLetterMap" class="mt-6" />
      </div>

      <div v-if="selectedMessage.includes('Medianet')" class="mt-6">
        <MedianetConfig :medianet-plans="medianetPlans" :selected-plans="selectedPlans"
          :selected-values="selectedValues" :min-values="minValues" :max-values="maxValues"
          @update:selectedPlans="selectedPlans = $event" @update:selectedValues="selectedValues = $event"
          @update:minValues="minValues = $event" @update:maxValues="maxValues = $event" />
      </div>

      <div v-if="selectedMessage.includes('Datafast')" class="mt-6">
        <DatafashConfig :datafast-Plans="datafastPlans" :selected-plans="selectedPlans"
          :selected-values="selectedValues" :min-values="minValues" :max-values="maxValues"
          @update:selectedPlans="selectedPlans = $event" @update:selectedValues="selectedValues = $event"
          @update:minValues="minValues = $event" @update:maxValues="maxValues = $event" />
      </div>

      <div v-if="selectedMessage.includes('Austro')" class="mt-6">
        <AustroConfig :autro-Plans="autroPlans" :selected-plans="selectedPlans" :selected-values="selectedValues"
          :min-values="minValues" :max-values="maxValues" @update:selectedPlans="selectedPlans = $event"
          @update:selectedValues="selectedValues = $event" @update:minValues="minValues = $event"
          @update:maxValues="maxValues = $event" />
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
import BinesConfig from './bines/BinesConfig.vue';

const planToLetterMap = {
  "Plan Pagos Normal": "N",
  "Plan Pago Especial": "X",
  "Diferido Propio (Con interes)": "P",
  "Diferido Corriente (Sin interes)": "D",
  "Corriente": "C",
  "Diferido Plus (Mixto)": "M",
  "Diferido Preferente": "L",
};

const bines = [
  { network: 'Interdin', description: 'Banco Dinner Club/Pichincha' },
  { network: 'Medianet', description: 'Banco Bolivariano/Internacional' },
  { network: 'Medianet Prod', description: 'Produbanco' },
  { network: 'Datafast', description: 'Banco Guayaquil/Pacifico' }
];

const selectedNetwork = ref('');
const showModal = ref(false);
const mostrarLista = ref(false);

const abrirModal = (network) => {
  selectedNetwork.value = network;
  showModal.value = true;
};

const toggleBinesList = () => {
  mostrarLista.value = !mostrarLista.value;
};

const plans = Object.keys(planToLetterMap);
const medianetPlans = ["Plan Pagos Mes a Mes Sin Intereses", "Diferido Propio (Con interes)", "Diferido Corriente (Sin interes)", "Corriente"];
const autroPlans = ["Diferido Sin interes especial", "Diferido Propio (Con interes)", "Diferido corriente (Sin interes)", "Corriente"];
const datafastPlans = ["Diferido Propio (Con interes)", "Diferido corriente (Sin interes)", "Corriente"];

const networks = [
  { name: 'Interdin', description: 'Red procesadora Interdin.' },
  { name: 'Medianet', description: 'Red procesadora  Medianet.' },
  { name: 'Datafast', description: 'Red procesadora  Datafast.' },
  { name: 'Austro', description: 'Red procesadora  Austro.' },
];

const selectedMessage = ref("");
const selectedPlans = ref([]);
const selectedValues = ref({});
const minValues = ref({});
const maxValues = ref({});
const hasCorriente = ref(false);

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
</script>
