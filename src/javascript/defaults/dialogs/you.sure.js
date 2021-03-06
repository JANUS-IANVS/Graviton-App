import Dialog from '../../constructors/dialog'

function areYouSureDialog() {
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title: 'Are you sure?',
			content: 'Be careful.',
			buttons: [
				{
					label: 'misc.No',
					action: reject,
				},
				{
					label: 'misc.Yes',
					action: resolve,
				},
			],
		})
		DialogInstance.launch()
	})
}

export default areYouSureDialog
