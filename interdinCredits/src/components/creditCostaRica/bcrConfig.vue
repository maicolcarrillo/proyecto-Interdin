<template>
    <div>
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
                Configuración BCR - Datos Cargados
            </h1>
            <p class="text-gray-600 mb-4">
                Los datos del Excel se han procesado correctamente
            </p>
        </div>

        <!-- Visualización en formato JSON -->
        <div class="bg-gray-50 p-6 rounded-lg shadow-md max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-700">
                    Estructura JSON generada
                </h2>
                <button @click="copyToClipboard"
                    class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition">
                    Copiar JSON
                </button>
            </div>

            <div class="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre class="text-green-400 text-sm font-mono">{{ formattedJson }}</pre>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-between mt-6">
                <button @click="$emit('back')"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                    ← Volver
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    excelData: {
        type: Array,
        required: true
    }
});

const emits = defineEmits(['back']);

// Formatea los datos del Excel a la estructura JSON deseada
const formattedJson = computed(() => {
    // Aquí transformamos los datos del Excel al formato requerido
    const jsonStructure = {
        include: [{
            ranges: props.excelData
                .filter(row => row.bin) // Asume que hay columnas bin, start, end en el Excel
                .map(row => ({
                    bin: row.bin.toString(),
                    start: row.start?.toString() || row.bin.toString() + '00',
                    end: row.end?.toString() || row.bin.toString() + '99'
                })),
            credits: props.excelData
                .filter(row => row.code) // Asume que hay columnas para créditos
                .map(row => ({
                    code: row.code,
                    description: row.description || `PLAN ${row.installment} CUOTAS`,
                    installment: parseInt(row.installment) || 0,
                    merchantCode: row.merchantCode || '',
                    terminalNumber: row.terminalNumber || ''
                }))
        }]
    };

    return JSON.stringify(jsonStructure, null, 2);
});

const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson.value);
    alert('JSON copiado al portapapeles');
};

</script>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>