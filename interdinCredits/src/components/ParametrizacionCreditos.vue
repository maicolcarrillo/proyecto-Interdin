<template>
  <!-- Banner de emergencia -->
  <div id="banner" class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 z-50">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-indigo-600 p-2 shadow-lg sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="h-6 w-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z">
                </path>
              </svg>
            </span>
            <p class="ml-3 truncate font-medium text-white">
              <span class="hidden md:inline">
                Estamos realizando mejoras en la Herramienta de Tipo de Créditos para
                incluir otros países.<br>
                Estos cambios no aplicarán al Tipo de Créditos de Ecuador.
              </span>
            </p>
          </div>
          <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
            <button type="button" onclick="this.closest('#banner').remove()"
              class="-mr-1 flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">
              <span class="sr-only">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                class="h-6 w-6 text-white">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Banner de emergencia -->

  <div class="flex items-start gap-4 my-6 justify-center">
    <!-- Botón Países -->
    <div class="relative w-64">
      <button @click.prevent="togglePaisList"
        class="w-full bg-white text-gray-900 text-sm font-medium text-center rounded-md shadow-md py-3 px-6 flex items-center justify-center gap-2 transition duration-300 hover:bg-black hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black">
        {{ paisSeleccionado || 'Selecciona un país' }}
        <svg :class="{ 'rotate-180': mostrarListaPais }" class="w-4 h-4 transition-transform duration-200" fill="none"
          stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="fade">
        <div v-if="mostrarListaPais"
          class="absolute left-0 w-full bg-white rounded-md shadow-md border border-gray-200 mt-2 overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li>
              <button @click="redirigirAPais('ecuador')"
                class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-3">
                <img src="https://flagcdn.com/w20/ec.png" alt="Ecuador" class="w-5 h-auto rounded-sm">
                <span>Ecuador</span>
              </button>
            </li>
            <li>
              <button @click="redirigirAPais('costa-rica')"
                class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-3">
                <img src="https://flagcdn.com/w20/cr.png" alt="Costa Rica" class="w-5 h-auto rounded-sm">
                <span>Costa Rica</span>
              </button>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Botón Bines (SOLO para Ecuador) -->
    <div v-if="paisSeleccionado === 'Ecuador'" class="relative w-64">
      <button @click.prevent="toggleBinesList"
        class="w-full bg-white text-gray-900 text-sm font-medium text-center rounded-md shadow-md py-3 px-6 flex items-center justify-center gap-2 transition duration-300 hover:bg-black hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black">
        Bines
        <svg :class="{ 'rotate-180': mostrarLista }" class="w-4 h-4 transition-transform duration-200" fill="none"
          stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="fade">
        <div v-if="mostrarLista"
          class="absolute left-0 min-w-[20rem] bg-white rounded-md shadow-md border border-gray-200 mt-2 overflow-hidden z-50">
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
  </div>

  <!-- Componente Hijo: Modal JSON -->
  <BinesConfig :network="selectedNetwork" :visible="showModal" @close="showModal = false" />

  <!-- Contenido principal (solo para Ecuador) -->
  <div v-if="!$route.path.includes('costa-rica')" class="bg-gray-100 min-h-screen p-4">
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
                    placeholder="Ej: 10" />
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
import { useRouter } from 'vue-router';
import CreditConfigGenerator from './CreditConfigGenerator.vue';
import MedianetConfig from './MedianetConfig.vue';
import DatafashConfig from './DatafashConfig.vue';
import AustroConfig from './AustroConfig.vue';
import BinesConfig from './bines/BinesConfig.vue';

const router = useRouter();

// Funcionalidad de selección de país
const paisSeleccionado = ref('Ecuador');
const mostrarListaPais = ref(false);

const togglePaisList = () => {
  mostrarListaPais.value = !mostrarListaPais.value;
};

const redirigirAPais = (pais) => {
  mostrarListaPais.value = false;
  paisSeleccionado.value = pais === 'ecuador' ? 'Ecuador' : 'Costa Rica';

  if (pais === 'ecuador') {
    router.push('/ecuador');
  } else {
    router.push('/costa-rica');
  }
};

// Tipos de Créditos

const planToLetterMap = {
  "Plan Pagos Normal": "N",
  "Plan Pago Especial": "X",
  "Diferido Propio (Con interes)": "P",
  "Diferido Corriente (Sin interes)": "D",
  "Corriente": "C",
  "Diferido Plus (Mixto)": "M",
  "Diferido Preferente": "L",
};

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
const medianetPlans = ["Plan Pagos Mes a Mes Sin Intereses", "Diferido Con interes", "Diferido Sin interes", "Corriente"];
const autroPlans = ["Diferido Sin interes especial", "Diferido Con interes", "Diferido Sin interes", "Corriente"];
const datafastPlans = ["Diferido Con interes", "Diferido Sin interes", "Corriente"];

const networks = [
  { name: 'Interdin', description: 'Red procesadora Interdin.' },
  { name: 'Medianet', description: 'Red procesadora Medianet.' },
  { name: 'Datafast', description: 'Red procesadora Datafast.' },
  { name: 'Austro', description: 'Red procesadora Austro.' },
];

const bines = [
  { network: 'Interdin', description: 'Banco Dinner Club/Pichincha' },
  { network: 'Medianet', description: 'Banco Bolivariano/Internacional' },
  { network: 'Medianet Pro', description: 'Produbanco' },
  { network: 'Datafast Pac', description: 'Banco Pacifico' },
  { network: 'Datafast', description: 'Banco Guayaquil' }
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
  const cleanedValue = value.replace(/[^0-9,]/g, '');
  if (value.includes(',')) {
    selectedValues.value[plan] = cleanedValue.split(',').map((v) => v.trim());
  } else {
    selectedValues.value[plan] = cleanedValue;
  }
};
</script>