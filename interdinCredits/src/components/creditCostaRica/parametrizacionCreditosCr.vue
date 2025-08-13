<template>
    <div class="bg-gray-100 min-h-screen p-4">
        <div class="container mx-auto pt-12 pb-20">
            <!-- Vista de selección de adquirente Cards-->
            <div v-if="!selectedAcquirer">
                <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
                    Bienvenido a parametrización de tipo de créditos Costa Rica
                </h1>
                <p class="text-gray-700 text-lg text-center mb-12">
                    Debes seleccionar el adquirente correspondiente
                </p>
                <p v-if="selectedMessage" class="text-center text-lg font-semibold text-blue-600 mb-6 mt-8">
                    {{ selectedMessage }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div @click="selectAcquirer('BCR')"
                        class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">
                        <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">BCR</h2>
                        <p class="text-gray-700 group-hover:text-white">
                            Adquirente BCR Costa Rica
                        </p>
                    </div>
                    <div @click="selectAcquirer('Davivienda CR')"
                        class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">
                        <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">Davivienda CR</h2>
                        <p class="text-gray-700 group-hover:text-white">
                            Adquirente Davivienda Costa Rica
                        </p>
                    </div>
                </div>
            </div>

            <!-- Vista de carga de archivos -->
            <div v-else>
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        Carga de documentos para {{ selectedAcquirer }}
                    </h1>
                    <p class="text-gray-600">
                        Por favor suba el archivo Excel requerido para continuar
                    </p>
                </div>

                <!-- Componente de carga -->
                <div class="py-8 bg-white px-2 rounded-lg shadow-md">
                    <div class="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                        <div class="md:flex">
                            <div class="w-full p-3">
                                <div
                                    class="relative border-dotted h-48 rounded-lg border-dashed border-2 border-back-700 bg-gray-100 flex justify-center items-center">
                                    <div class="absolute">
                                        <div class="flex flex-col items-center">
                                            <i class="fa fa-folder-open fa-4x text-black-700"></i>
                                            <span class="block text-gray-400 font-normal mt-2">Arrastre el archivo Excel
                                                aquí o haga clic para seleccionar</span>
                                        </div>
                                    </div>
                                    <input type="file" class="h-full w-full opacity-0 cursor-pointer" multiple>
                                </div>
                                <div class="mt-4 text-center">
                                    <button
                                        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-700">
                                        Subir Archivos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botón para volver -->
                <div class="text-center mt-8">
                    <button @click="selectedAcquirer = ''"
                        class="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                        ← Volver a la selección
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedMessage = ref("");
const selectedAcquirer = ref("");

const selectAcquirer = (message) => {
    selectedMessage.value = `Has seleccionado ${message}.`;
    selectedAcquirer.value = message;

    // Agregar Font Awesome dinámicamente si no está presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
        document.head.appendChild(link);
    }
};
</script>