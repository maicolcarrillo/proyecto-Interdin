<template>
    <div>
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
                Configuración BCT - Datos Cargados
            </h1>
            <p class="text-gray-600 mb-4">
                Los datos del Excel se han procesado correctamente
            </p>
        </div>

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

// 🧹 Limpieza de claves y valores del Excel
const cleanedData = computed(() => {
    return props.excelData.map(row => {
        const clean = {};
        Object.keys(row).forEach(key => {
            const cleanKey = key.replace(/\s+/g, '').trim();
            const value = row[key];
            clean[cleanKey] = typeof value === 'string' ? value.trim() : value;
        });
        return clean;
    });
});

// 🧠 Genera la estructura JSON
const jsonStructure = computed(() => {
    let pibot = 1; // 🔹 Comienza en 1
    const creditsMap = new Map();

    // --- Rangos únicos ---
    const allRanges = cleanedData.value
        .filter(row => row.bin && row.start && row.end)
        .map(row => ({
            bin: row.bin.toString(),
            start: row.start.toString(),
            end: row.end.toString()
        }));

    const uniqueRanges = allRanges.filter((range, index, self) =>
        index === self.findIndex(r =>
            r.bin === range.bin &&
            r.start === range.start &&
            r.end === range.end
        )
    );

    // --- Créditos únicos ---
    const seenDescriptions = new Set();

    cleanedData.value.forEach(row => {
        const typesValue = row.typesCredit?.trim();
        if (!typesValue) return;

        const creditTypes = typesValue.split(",").map(ct => ct.trim()).filter(Boolean);

        creditTypes.forEach(typeText => {
            // Evita duplicados
            if (seenDescriptions.has(typeText)) return;
            seenDescriptions.add(typeText);

            // Detecta número de cuotas
            const match = typeText.match(/(\d+)\s*[mM]/) || typeText.match(/(\d+)\s*[cC]uotas?/);
            const installment = match ? parseInt(match[1]) : 0;

            // Genera código
            const formattedInstallment = installment.toString().padStart(2, '0');
            const code = `${formattedInstallment}AD${pibot}`;

            // Guarda el crédito
            creditsMap.set(typeText, {
                code,
                description: typeText,
                installment,
                merchantCode: row.merchantCode?.toString() || '',
                terminalNumber: row.terminalNumber?.toString() || ''
            });

            // Incrementa el pivote
            pibot += 2;
        });
    });

    const uniqueCredits = Array.from(creditsMap.values());

    return {
        include: [
            {
                ranges: uniqueRanges,
                credits: uniqueCredits
            }
        ]
    };
});


// 🧾 JSON formateado o comprimido
const formattedJson = computed(() => JSON.stringify(jsonStructure.value, null, 2));
const compressedJson = computed(() => JSON.stringify(jsonStructure.value));
const displayedJson = computed(() => (showCompressed.value ? compressedJson.value : formattedJson.value));

// 🧩 Funciones de control
const toggleJsonFormat = () => (showCompressed.value = !showCompressed.value);

const copyToClipboard = () => {
    navigator.clipboard.writeText(displayedJson.value);
    alert('JSON copiado al portapapeles');
};
</script>
