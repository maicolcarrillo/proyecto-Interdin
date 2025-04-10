<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/10 backdrop-blur-[1px]"
      @click.self="$emit('close')" role="dialog" aria-modal="true">
      <div class="bg-white/95 p-6 rounded-xl shadow-lg w-full max-w-2xl mx-4 border border-gray-200/50">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-800">
            Configuración BIN - {{ network }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        <!--Botones de Formateo JSON-->
        <div class="flex gap-2 mb-4">
          <button @click="formattingRawJson"
            class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all">
            <span>Formateo JSON</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v4m-6 6h4a2 2 0 002-2v-4" />
            </svg>
          </button>

          <button @click="formattingBeautify"
            class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all">
            <span>Beautify</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536M9 11l3.586-3.586a2 2 0 012.828 0l1.172 1.172a2 2 0 010 2.828L13 15M6 18h.01" />
            </svg>
          </button>
        </div>


        <div
          class="bg-gray-50/70 p-4 rounded-lg max-h-[70vh] overflow-y-auto border border-gray-200/30 text-sm font-mono text-gray-800 whitespace-pre-wrap">
          <div v-html="formattedJsonHtml" />
        </div>

        <div class="flex justify-between items-center mt-4">
          <button @click="copiarJson"
            class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all">
            <span v-if="copiado" class="text-green-600">✓ Copiado</span>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v4m-6 6h4a2 2 0 002-2v-4" />
              </svg>
              Copiar JSON
            </template>
          </button>

          <button @click="$emit('close')"
            class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  network: String,
  visible: Boolean
})

const emit = defineEmits(['close'])

const networksJson = {
  Interdin: {
    selection_rules: {
      issuing_and_acquirer_banks_match: true,
      bin: {
        policy: 'allows',
        collection: ["365454",
          "360218",
          "364172",
          "364173",
          "365025",
          "365453",
          "369991",
          "365424",
          "369972",
          "364171",
          "361349",
          "365420",
          "365147",
          "362062",
          "365026",
          "365426",
          "369997",
          "365253",
          "360857",
          "360858",
          "360859",
          "360860",
          "360871",
          "360872",
          "360885",
          "367092",
          "360888",
          "655951",
          "800001",
          "655732",
          "655737",
          "655734",
          "655736",
          "655733",
          "655735",
          "685500",
          "650460",
          "655500",
          "655501",
          "687559",
          "411077",
          "900030",
          "414757",
          "499801",
          "499802",
          "450081",
          "415465",
          "404837",
          "404838",
          "404839",
          "423023",
          "476862",
          "518923",
          "518114",
          "518115",
          "552536",
          "554439",
          "558659",
          "521329",
          "518968",
          "546605",
          "512345",
          "960010",
          "960040",
          "960060",
          "960080",
          "558284",
          "516986",
          "960011",
          "517122",
          "960013",
          "222670",
          "960018",
          "510127",
          "555067",
          "223067",
          "407346",
          "407345",
          "418788",
          "479305",
          "424285",
          "459353",
          "456867",
          "469717",
          "900040",
          "405786",
          "405987",
          "473882",
          "439474",
          "456789",
          "456788",
          "456787",
          "473293",
          "451432",
          "450661",
          "496602",
          "473296",
          "473294",
          "493779",
          "438108",
          "439098",
          "454819",
          "856070",
          "812600",
          "438107",
          "900010",
          "433820",
          "462943",
          "900020",
          "900011",
          "446005",
          "446004",
          "446141",
          "400925",
          "900012",
          "445444",
          "445445",
          "445446",
          "445447",
          "900130",
          "900150",
          "900160",
          "900170",
          "900013",
          "469716",
          "900019",
          "477281",
          "459424",
          "900023",
          "900110",
          "900165",
          "900195",
          "449620",
          "453774",
          "417074",
          "476861",
          "223066",
          "232005",
          "232006",
          "232008",
          "232200",
          "232003",
          "232011",
          "427698",
          "469706",
          "476843",
          "360041",
          "360138",
          "360219",
          "360492",
          "361138",
          "361329",
          "361865",
          "361866",
          "361867",
          "361868",
          "361869",
          "362620",
          "362621",
          "362622",
          "363999",
          "364170",
          "364190",
          "364234",
          "364261",
          "364444",
          "364522",
          "364700",
          "364701",
          "364702",
          "364703",
          "364716",
          "364717",
          "364719",
          "365001",
          "365023",
          "365166",
          "365167",
          "365168",
          "365169",
          "365181",
          "365254",
          "365255",
          "365256",
          "365421",
          "365422",
          "365423",
          "365425",
          "365427",
          "365428",
          "365429",
          "365488",
          "361171",
          "650458",
          "404840"]
      }
    }
  },
  Medianet: {
    selection_rules: {
      issuing_and_acquirer_banks_match: true,
      bin: {
        policy: 'allows',
        collection: ["512294",
          "512401",
          "519209",
          "520081",
          "521384",
          "549618",
          "553634",
          "880001",
          "880002",
          "880003",
          "880004",
          "880005",
          "880006",
          "880007",
          "880008",
          "880009",
          "880010",
          "880011",
          "880012",
          "880013",
          "880014",
          "880015",
          "626289",
          "626293",
          "626294",
          "626425",
          "402748",
          "402749",
          "404808",
          "410283",
          "410284",
          "410285",
          "422282",
          "442288",
          "442289",
          "442290",
          "451375",
          "456363",
          "475398",
          "481351",
          "492418",
          "493849",
          "493850",
          "498892",
          "475395",
          "422249",
          "515638",
          "527498",
          "537701",
          "553660",
          "556614",
          "803004",
          "803006",
          "803007",
          "803008",
          "803012",
          "803013",
          "803014",
          "803015",
          "421907",
          "439471",
          "439472",
          "439473",
          "465775",
          "484696",
          "423140",
          "423144",
          "468570",
          "468571",
          "408386",
          "422139",
          "455898",
          "512102",
          "515826",
          "517466",
          "518172",
          "520133",
          "521309",
          "522409",
          "523768",
          "524489",
          "524568",
          "530054",
          "540771",
          "545195",
          "547649",
          "550227",
          "552036",
          "539706",
          "400929",
          "400931",
          "407426",
          "412221",
          "414785",
          "415788",
          "419560",
          "421746",
          "421906",
          "422603",
          "434900",
          "450791",
          "450806",
          "462222",
          "523777",
          "553677",
          "554277",
          "403378",
          "417882",
          "417883",
          "422019",
          "456872",
          "456889",
          "477179",
          "489956",
          "489957",
          "407851",
          "419561",
          "481379",
          "428089",
          "477045",
          "477046",
          "477047",
          "423141",
          "418263",
          "526257",
          "529777",
          "549568",
          "484697",
          "499883",
          "444088"
        ]
      }
    }
  },

  'Medianet Prod': {
    selection_rules: {
      issuing_and_acquirer_banks_match: true,
      bin: {
        policy: 'allows',
        collection: ["545195",
          "522409",
          "517466",
          "524489",
          "512102",
          "518172",
          "521309",
          "550227",
          "552036",
          "530054",
          "540771",
          "523768",
          "524568",
          "434900",
          "400931",
          "476860",
          "419560",
          "450806",
          "400929",
          "481379",
          "450791",
          "421746",
          "473295",
          "419561",
          "414785",
          "421906",
          "409806",
          "434901",
          "450059",
          "514072",
          "627123",
          "407426",
          "412221",
          "422226",
          "481379",
          "400929",
          "421746",
          "414785",
          "512102",
          "515816",
          "515826",
          "518172",
          "520133",
          "521309",
          "524489",
          "517466",
          "523768",
          "530054",
          "539706",
          "540771",
          "547649",
          "550227",
          "552036",
          "492522",
          "492523",
          "436402",
          "436403",
          "423988",
          "416682",
          "416683",
          "416685",
          "416684",
          "422603",
          "415788",
          "530219",
          "531950"
        ]
      }
    }
  },
  Datafast: {
    selection_rules: {
      issuing_and_acquirer_banks_match: true,
      bin: {
        policy: 'allows',
        collection: ["376650",
          "376651",
          "376652",
          "376653",
          "376654",
          "376659",
          "377046",
          "377047",
          "411076",
          "433437",
          "451415",
          "454063",
          "454064",
          "454086",
          "476942",
          "510604",
          "514440",
          "523042",
          "524071",
          "536031",
          "536768",
          "536781",
          "546843",
          "549145"
        ]
      }
    }
  }
}

// Utilidad para colorear el JSON como en un editor
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2)
  }
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?!:)|\b(true|false|null)\b|\b\d+\b)/g, match => {
    let cls = 'text-gray-800'
    if (/^"/.test(match)) {
      cls = match.endsWith(':') ? 'text-purple-600' : 'text-green-600'
    } else if (/true|false/.test(match)) {
      cls = 'text-indigo-600 font-semibold'
    } else if (/null/.test(match)) {
      cls = 'text-pink-500 italic'
    } else if (/^\d+$/.test(match)) {
      cls = 'text-blue-500'
    }
    return `<span class="${cls}">${match}</span>`
  })
}

const formattedJsonHtml = computed(() => {
  const data = networksJson[props.network]
  return data ? syntaxHighlight(data) : '<span class="text-red-500">No hay configuración disponible.</span>'
})

const copiado = ref(false)
const copiarJson = async () => {
  try {
    const data = networksJson[props.network]
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    copiado.value = true
    setTimeout(() => copiado.value = false, 2000)
  } catch (e) {
    console.error('Error al copiar:', e)
  }
}
</script>
