import path from 'path'
const fs = window.require('fs-extra')
const electronStore = window.require('electron-store')
const getAppDataPath = window.require('appdata-path')

const DEFAULT_STATIC_CONFIGURATION = {
	config: {
		appTheme: 'Arctic',
		appLanguage: 'english',
		editorFontSize: '16',
		appProjectsLog: [],
		appConfigPath: path.join(getAppDataPath(), '.graviton2'),
		appWorkspacesLog: [],
		appZoom: 1,
		editorFSWatcher: true,
		editorAutocomplete: true,
		editorIndentation: 'tab',
		editorTabSize: 4,
		editorFontFamily: 'JetBrainsMono',
		editorWrapLines: false,
		appPlatform: 'auto',
		appShortcuts: {
			SaveCurrentFile: {
				combos: ['Ctrl+S'],
			},
			NewPanel: {
				combos: ['Ctrl+N'],
			},
			CloseCurrentTab: {
				combos: ['Ctrl+T'],
			},
			CloseCurrentPanel: {
				combos: ['Ctrl+L'],
			},
			OpenEditorCommandPrompt: {
				combos: ['Ctrl+I'],
			},
			OpenCommandPrompt: {
				combos: ['Ctrl+P'],
			},
			IterateCurrentPanelTabs: {
				combos: ['Ctrl+Tab'],
			},
			IncreaseEditorFontSize: {
				combos: ['Ctrl+Up', 'Ctrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: ['Ctrl+Down', 'Ctrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
		},
		miscEnableLiveUpdateInManualConfig: true,
		appBlurEffect: 10,
		appCheckUpdatesInStartup: true,
		appEnableSidebar: true,
		appEnableSidepanel: true,
		appEnableExplorerItemsAnimations: true,
		appOpenWelcomeInStartup: true,
		appCache: {
			store: {
				plugins: [],
			},
		},
		editorsClients: [],
	},
}

function checkObject(object, subProperty, configurationStore, level) {
	if (level >= 2) return
	Object.keys(object).map(key => {
		let currentLevel = level
		const query = `config${subProperty ? `.${subProperty}` : ''}.${key}`
		if (!configurationStore.has(query)) {
			configurationStore.set(query, object[key])
		}
		const queryValue = object[key]
		if (typeof queryValue == 'object' && !Array.isArray(queryValue)) {
			checkObject(queryValue, key, configurationStore, ++currentLevel)
		}
	})
}

function initConfiguration() {
	const configurationStore = new electronStore()
	console.log(configurationStore)
	checkObject(DEFAULT_STATIC_CONFIGURATION.config, null, configurationStore, 0)
	const gravitonConfigPath = configurationStore.get('config').appConfigPath
	const gravitonPluginsPath = path.join(gravitonConfigPath, 'plugins')

	//If .graviton2 doesn't exist, it creates it
	if (!fs.existsSync(gravitonConfigPath)) {
		fs.mkdirSync(gravitonConfigPath)
	}

	//If .graviton2/plugins doesn't exist, it creates it
	if (!fs.existsSync(gravitonPluginsPath)) {
		fs.mkdirSync(gravitonPluginsPath)
	}

	return configurationStore
}

function getConfiguration() {
	const store = initConfiguration()
	return {
		store: store,
		config: store.get('config'),
	}
}

export { initConfiguration, getConfiguration }
