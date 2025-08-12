<template>
    <div class="bg-gray-100 min-h-screen p-4">
        <div class="container mx-auto pt-12 pb-20">
            <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
                Bienvenido a parametrización de tipo de créditos Costa Rica
            </h1>
            <p class="text-gray-700 text-lg text-center mb-12">
                Debes seleccionar la red procesadora correspondiente
            </p>
            <p v-if="selectedMessage" class="text-center text-lg font-semibold text-blue-600 mb-6 mt-8">
                {{ selectedMessage }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div @click="selectMessage('BCR')"
                    class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">
                    <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">BCR</h2>
                    <p class="text-gray-700 group-hover:text-white">
                        Adquirente BCR Costa Rica
                    </p>
                </div>
                <div @click="selectMessage('Davivienda CR')"
                    class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">
                    <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">Davivienda CR</h2>
                    <p class="text-gray-700 group-hover:text-white">
                        Adquirente Davivienda Costa Rica
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedMessage = ref("");
const selectMessage = (message) => {
    selectedMessage.value = `Has seleccionado ${message}.`;
};
</script>