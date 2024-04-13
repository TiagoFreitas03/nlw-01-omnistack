import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import '../styles/dropzone.css'

interface DropzoneProps {
	onFileUploaded: (file: File) => void
}

export function Dropzone({ onFileUploaded }: DropzoneProps) {
	const [selectedFileUrl, setSelectedFileUrl] = useState('')

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0]

		const fileUrl = URL.createObjectURL(file)

		setSelectedFileUrl(fileUrl)
		onFileUploaded(file)
	}, [onFileUploaded])

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	return (
		<div {...getRootProps()} className='dropzone'>
			<input {...getInputProps()} accept='image/*' />

			{
				selectedFileUrl !== ''
					? <img src={selectedFileUrl} alt="Imagem do estabelecimento" />
					: (
						<p>
							<FiUpload />
							Imagem do estabelecimento
						</p>
					)
			}
		</div>
	)
}
