const fs = window.require('fs')
const { join } = window.require('path')
import RunningConfig from 'RunningConfig'

RunningConfig.data.envs.push({
	name: 'NPM',
	filter(dir) {
		if (fs.existsSync(join(dir, 'package.json'))) {
			return window.require(join(dir, 'package.json'))
		}
		return false
	},
})

function detectEnv(folder) {
	return new Promise(resolve => {
		const Envs = RunningConfig.data.envs

		for (const { name, filter } of Envs) {
			const pass = filter(folder)
			if (pass instanceof Promise) {
				pass
					.then(data => {
						if (data) {
							resolve({
								env: name,
								info: data,
							})
						}
					})
					.catch(() => {
						//Continue searching
					})
			} else {
				if (pass) {
					resolve({
						env: name,
						info: pass,
					})
				}
			}
		}
	})
}

export default detectEnv
