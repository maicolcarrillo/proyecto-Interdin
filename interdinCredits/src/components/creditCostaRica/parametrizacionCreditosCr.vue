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
                    <div @click="selectAcquirer('BCT')"
                        class="group transform bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black">
                        <h2 class="text-xl font-bold text-gray-800 group-hover:text-white mb-4">Banco BCT CR</h2>
                        <p class="text-gray-700 group-hover:text-white">
                            Adquirente BCT Costa Rica
                        </p>
                    </div>
                </div>
            </div>

            <!-- Vista de configuración para BCR -->
            <div v-else-if="selectedAcquirer === 'BCR' && excelData">
                <BCRConfig :excelData="excelData" @back="resetSelection" />
            </div>

            <!-- Vista de configuración para Davivienda -->
            <div v-else-if="selectedAcquirer === 'Davivienda CR' && excelData">
                <DaviviendaConfig :excelData="excelData" @back="resetSelection" />
            </div>

             <!-- Vista de configuración para BCT -->
            <div v-else-if="selectedAcquirer === 'BCT' && excelData">
                <BCTConfig :excelData="excelData" @back="resetSelection" />
            </div>

            <!-- Vista de carga de archivos -->
            <div v-else>
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        Carga de documentos para {{ selectedAcquirer }}
                    </h1>
                    <p class="text-gray-600 mb-4">
                        Por favor suba el archivo Excel requerido para continuar
                    </p>

                    <!-- Aviso sobre la estructura -->
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-3xl mx-auto shadow-sm">
                        <p class="text-yellow-700 font-medium mb-3">
                            ⚠️ Importante: el archivo Excel debe contener las siguientes columnas
                        </p>
                        <div class="overflow-x-auto">
                            <table class="min-w-full border border-gray-300 rounded-lg text-sm">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="px-3 py-2 border">terminalNumber</th>
                                        <th class="px-3 py-2 border">merchantCode</th>
                                        <th class="px-3 py-2 border">typesCredit</th>
                                        <th class="px-3 py-2 border">bin</th>
                                        <th class="px-3 py-2 border">start</th>
                                        <th class="px-3 py-2 border">end</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center">
                                        <td class="px-3 py-2 border">10107385</td>
                                        <td class="px-3 py-2 border">011142500120000</td>
                                        <td class="px-3 py-2 border">03CDU / 03BCR</td>
                                        <td class="px-3 py-2 border">411757</td>
                                        <td class="px-3 py-2 border">41175734</td>
                                        <td class="px-3 py-2 border">41175760</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Componente de carga con estilo específico -->
                <div class="py-20 bg-white px-2">
                    <div class="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                        <div class="md:flex">
                            <div class="w-full p-3">
                                <div
                                    class="relative border-dotted h-48 rounded-lg border-dashed border-2 border-black-700 bg-gray-100 flex justify-center items-center">
                                    <div class="absolute">
                                        <div class="flex flex-col items-center">
                                            <i class="fa fa-folder-open fa-4x text-black-700"></i>
                                            <span class="block text-gray-400 font-normal mt-2">Arrastre el archivo Excel
                                                aquí</span>
                                            <span class="block text-grBclay-400 text-sm">o haga clic para
                                                seleccionar</span>
                                        </div>
                                    </div>
                                    <input type="file" class="h-full w-full opacity-0 cursor-pointer"
                                        accept=".xlsx, .xls, .csv" @change="handleFileUpload" ref="fileInput">
                                </div>
                                <div class="mt-4 text-center">
                                    <button
                                        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-700"
                                        :disabled="!file" @click="processExcel">
                                        Procesar Archivo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botón para volver -->
                <div class="text-center mt-8">
                    <button @click="resetSelection"
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
import * as XLSX from 'xlsx';
import DaviviendaConfig from './daviviendaConfig.vue';
import BCRConfig from './bcrConfig.vue';
import BCTConfig from './bctConfig.vue'

const selectedMessage = ref("");
const selectedAcquirer = ref("");
const file = ref(null);
const excelData = ref(null);
const fileInput = ref(null);

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

const handleFileUpload = (event) => {
    file.value = event.target.files[0];
};

const processExcel = async () => {
    if (!file.value) return;

    try {
        const data = await file.value.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { raw: false });

        excelData.value = jsonData;
    } catch (error) {
        console.error("Error al procesar el Excel:", error);
        alert("Error al procesar el archivo. Asegúrese de que es un Excel válido.");
    }
};

const resetSelection = () => {
    selectedAcquirer.value = "";
    selectedMessage.value = "";
    file.value = null;
    excelData.value = null;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};
</script>