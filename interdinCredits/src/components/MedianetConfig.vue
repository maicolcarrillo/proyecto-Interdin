<template>
    <div class="bg-white p-6 rounded-lg shadow mt-6">
      <button @click="generateJSON"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 transition-colors">
        Generar JSON
      </button>
  
      <div v-if="jsonData" class="grid grid-cols-2 gap-6 h-[700px]">
        <!-- Columna Izquierda - JSON Formateado -->
        <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-300 text-sm">JSON Formateado</span>
            <button @click="copyToClipboard(jsonFormatted)" class="text-gray-400 hover:text-white transition-colors">
              📝 Copiar
            </button>
          </div>
          <pre class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom">
            <code class="bg-gray-800/50 p-2 rounded inline-block min-w-full">{{ jsonFormatted }}</code>
          </pre>
        </div>
  
        <!-- Columna Derecha - JSON Compacto -->
        <div class="bg-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-300 text-sm">JSON Compacto</span>
            <button @click="copyToClipboard(jsonCompact)" class="text-gray-400 hover:text-white transition-colors">
              📝 Copiar
            </button>
          </div>
          <pre class="text-green-300 text-sm font-mono flex-1 overflow-auto scrollbar-custom">
            <code class="bg-gray-800/50 p-2 rounded">{{ jsonCompact }}</code>
          </pre>
        </div>
      </div>
    </div>
  </template>
  