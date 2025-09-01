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
    // Obtener todos los ranges únicos
    const allRanges = props.excelData
        .filter(row => row.bin && row.start && row.end)
        .map(row => ({
            bin: row.bin.toString(),
            start: row.start.toString(),
            end: row.end.toString()
        }));

    // Eliminar ranges duplicados
    const uniqueRanges = allRanges.filter((range, index, self) =>
        index === self.findIndex(r =>
            r.bin === range.bin &&
            r.start === range.start &&
            r.end === range.end
        )
    );

    // Obtener todos los credits únicos por typesCredit
    const creditsMap = new Map();

    props.excelData.forEach(row => {
        if (!row.typesCredit) return;

        const creditType = row.typesCredit;
        if (!creditsMap.has(creditType)) {
            // Parsear el installment desde typesCredit (ej: "03BCR" -> 3)
            const installment = parseInt(creditType.replace(/\D/g, '')) || 0;
            const formattedInstallment = installment.toString().padStart(2, '0');

            creditsMap.set(creditType, {
                code: `${formattedInstallment}CDU`,
                description: `A paguitos`,// A paguitos
                installment: installment,
                merchantCode: row.merchantCode?.toString() || '',
                terminalNumber: row.terminalNumber?.toString() || ''
            });
        }
    });

    const uniqueCredits = Array.from(creditsMap.values());

    return {
        include: [{
            ranges: uniqueRanges,
            credits: uniqueCredits
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