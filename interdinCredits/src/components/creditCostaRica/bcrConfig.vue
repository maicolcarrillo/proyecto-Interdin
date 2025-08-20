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
                <div class="flex items-center gap-4">
                    <button @click="$emit('back')"
                        class="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400 transition">
                        ← Volver
                    </button>
                    <h2 class="text-xl font-semibold text-gray-700">
                        Estructura JSON generada
                    </h2>
                </div>
                <div class="flex gap-2">
                    <button @click="toggleJsonFormat"
                        class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition">
                        {{ showCompressed ? 'Formatear' : 'Comprimir' }}
                    </button>
                    <button @click="copyToClipboard"
                        class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition">
                        Copiar JSON
                    </button>
                </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre class="text-green-400 text-sm font-mono">{{ displayedJson }}</pre>
            </div>

            <!-- Se eliminó el botón Volver duplicado del footer -->
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    excelData: {
        type: Array,
        required: true
    }
});

const emits = defineEmits(['back']);
const showCompressed = ref(false);

// Formatea los datos del Excel a la estructura JSON deseada
const jsonStructure = computed(() => {
    // Filtrar y validar las filas que tienen BIN, start y end
    const validRanges = props.excelData
        .filter(row => row.BIN && row.start && row.end)
        .map(row => ({
            bin: row.BIN.toString(),
            start: row.start.toString(),
            end: row.end.toString()
        }));

    // Filtrar y validar las filas que tienen datos de crédito
    const validCredits = props.excelData
        .filter(row => row.typesCredit && row.terminalNumber && row.merchantCode)
        .map(row => {
            // Parsear el installment desde typesCredit (ej: "03BCR" -> 3)
            const creditCode = row.typesCredit;
            const installment = parseInt(creditCode.replace(/\D/g, '')) || 0;

            // Formatear el code con ceros a la izquierda (ej: 3 -> "03")
            const formattedInstallment = installment.toString().padStart(2, '0');

            return {
                code: `0${formattedInstallment}BCR`, // Formato: 0XBCR
                description: `PLAN 0% ${installment} CUOTAS`,
                installment: installment,
                merchantCode: row.merchantCode.toString(),
                terminalNumber: row.terminalNumber.toString()
            };
        });

    return {
        include: [{
            ranges: validRanges,
            credits: validCredits
        }]
    };
});

// JSON formateado con indentación
const formattedJson = computed(() => {
    return JSON.stringify(jsonStructure.value, null, 2);
});

// JSON comprimido (una sola línea)
const compressedJson = computed(() => {
    return JSON.stringify(jsonStructure.value);
});

// JSON que se muestra actualmente
const displayedJson = computed(() => {
    return showCompressed.value ? compressedJson.value : formattedJson.value;
});

const toggleJsonFormat = () => {
    showCompressed.value = !showCompressed.value;
};

const copyToClipboard = () => {
    navigator.clipboard.writeText(displayedJson.value);
    alert('JSON copiado al portapapeles');
};

</script>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>