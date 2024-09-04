<template>
  <v-card variant="outlined" class="pa-4">
    <AppLabel>Select all that apply for your facility:</AppLabel>
    <div class="mt-4">
      <div>Is your facility located on K-12 school grounds or affiliated with a Board of Education?</div>
      <AppYesNoRadioGroup id="k12-school-grounds" v-model="model.k12SchoolGrounds" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
    <div>
      <div>Is your facility located in a municipal community center?</div>
      <AppYesNoRadioGroup id="municipal-community" v-model="model.municipalCommunity" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
    <div>
      <div>Is your facility located on Reserve?</div>
      <AppYesNoRadioGroup id="on-reserve" v-model="model.onReserve" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
    <div>
      <div>
        Is your facility designated as a
        <a href="https://www2.gov.bc.ca/gov/content?id=41CD55C0B3ED4F51A0274EDE85E886F5" target="_blank">Young Parent Program</a>
        (YPP) facility?
      </div>
      <AppYesNoRadioGroup id="ypp-designation" v-model="model.yppDesignation" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
    <div v-if="model.yppDesignation">
      <div>Do you currently have YPP families enrolled?</div>
      <AppYesNoRadioGroup id="ypp-enrolled" v-model="model.yppEnrolled" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
    <div>
      <div>Does your facility operate in a personal residence?</div>
      <AppYesNoRadioGroup id="personal-residence" v-model="model.personalResidence" :rules="rules.required" :hide-details="readonly" :disabled="readonly" />
    </div>
  </v-card>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppYesNoRadioGroup from '@/components/ui/AppYesNoRadioGroup.vue'
import rules from '@/utils/rules'

export default {
  components: { AppLabel, AppYesNoRadioGroup },
  props: {
    facility: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update'],
  data() {
    return {
      model: {},
    }
  },
  watch: {
    model: {
      handler() {
        this.model.yppEnrolled = this.model.yppDesignation ? this.model.yppEnrolled : null
        this.$emit('update', this.model)
      },
      deep: true,
    },
  },
  created() {
    this.rules = rules
    this.model = {
      k12SchoolGrounds: this.facility?.k12SchoolGrounds,
      municipalCommunity: this.facility?.municipalCommunity,
      onReserve: this.facility?.onReserve,
      yppDesignation: this.facility?.yppDesignation,
      yppEnrolled: this.facility?.yppEnrolled,
      personalResidence: this.facility?.personalResidence,
    }
  },
}
</script>
