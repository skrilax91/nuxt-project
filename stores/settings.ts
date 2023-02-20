// Store servant à gérer les paramètres de l'application

import { defineStore } from 'pinia'
import SettingRepository from "~/repositories/SettingRepository";
import Setting from "~/models/Setting";

interface State {
  tables: any[]
  locales: any[]
  locale: string
  defaultLocale: string
  activeTable: number
  isSelected: boolean
  isSelectLang: boolean
  isDefaultSelected: boolean
  licenceKey: string
  inited: boolean
  register: any
  settings: any
  last_update: number
  adminPassword: string
  companion: boolean
  faillure: boolean
  forceDetail: boolean
  disableBasket: boolean
  businessId: number | null

  businesses: any[]
}

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    tables: [],
    locales: [],
    locale: 'fr',
    defaultLocale: 'fr',
    activeTable: 0,
    isSelected: false,
    isSelectLang: false,
    isDefaultSelected: false,
    licenceKey: '',
    inited: false,
    register: null,
    settings: null,
    last_update: 0,
    adminPassword: '',
    companion: false,
    faillure: false,
    forceDetail: false,
    disableBasket: false,
    businessId: null,
    businesses: []
  }),

  getters: {
    IsInit(): boolean {
      return this.inited
    }
  },

  actions: {
    setLastUpdate(timestamp: number) {
        this.last_update = timestamp
    },

    setInited(inited: boolean) {
        this.inited = inited
    },

    async fetchSettings() {
        const settings = await SettingRepository.findAll();

        this.setLicenceKey(settings.find((s: Setting) => s.id === 'licenceKey')?.value);
        this.setAdminPassword(settings.find((s: Setting) => s.id === 'adminPassword')?.value);
        this.setTables(JSON.parse(settings.find((s: Setting) => s.id === 'tablesList')?.value));
        this.setLastUpdate(settings.find((s: Setting) => s.id === 'lastUpdate')?.value);
        this.setLocales(JSON.parse(settings.find((s: Setting) => s.id === 'locales')?.value));
        this.setForceDetail(settings.find((s: Setting) => s.id === 'forceDetail')?.value);
        this.setDisableBasket(settings.find((s: Setting) => s.id === 'disableBasket')?.value);
        this.setCompanion(settings.find((s: Setting) => s.id === 'localeIp')?.value);
        console.log(settings);
        console.log(this.locales);
    },

    setLocales(locales: any[]|undefined) {
        if (locales === undefined)
            locales = []
        this.locales = locales
    },

    setForceDetail(forceDetail: boolean) {
        this.forceDetail = forceDetail
    },

    setDisableBasket(disableBasket: boolean) {
        this.disableBasket = disableBasket
    },

    setTables(tables: any[]|undefined) {
        if (tables === undefined)
            tables = []
        this.tables = tables
    },
    setActiveTable(tableIndex: number) {
      this.activeTable = tableIndex + 1
    },
    setIsSelectedToTrue() {
      this.isSelected = true
    },
    setIsSelectedToFalse() {
      this.isSelected = false
      this.activeTable = 0
    },
    toggleSelectLang() {
      this.isSelectLang = !this.isSelectLang
    },
    setLocale(locale: string) {
      this.locale = locale
    },
    setAdminPassword(password: string) {
      this.adminPassword = password
    },
    setLicenceKey(key: any) {
      this.licenceKey = key
    },
    setCompanion(key: any) {
      this.companion = key
    },
    changeTables(tables: any) {
      this.setTables(tables)
      this.setActiveTable(0)
    },
  }
})