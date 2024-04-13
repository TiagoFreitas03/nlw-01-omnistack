import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'

import './styles.css'
import logo from '../../assets/logo.svg'
import { api } from '../../services/api'
import { Dropzone } from '../../components/Dropzone'

interface Item {
	id: number
	title: string
	image_url: string
}

interface IBGEUFResponse {
	sigla: string
}

interface IBGECityResponse {
	nome: string
}

export function CreatePoint() {
	const [items, setItems] = useState<Item[]>([])
	const [ufs, setUfs] = useState<string[]>([])
	const [cities, setCities] = useState<string[]>([])
	const [initialPosition] = useState<[number, number]>([-23.5574016, -46.637817])

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: ''
	})

	const [selectedUf, setSelectedUf] = useState('0')
	const [selectedCity, setSelectedCity] = useState('0')
	const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
	const [selectedItems, setSelectedItems] = useState<number[]>([])
	const [selectedFile, setSelectedFile] = useState<File>()

	const navigate = useNavigate()

	useEffect(() => {
		api.get('/items').then(response => {
			setItems(response.data)
		})
	}, [])

	useEffect(() => {
		axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
			const ufInitials = response.data.map((uf: IBGEUFResponse) => uf.sigla)
			setUfs(ufInitials)
		})
	}, [])

	useEffect(() => {
		if (selectedUf !== '0') {
			axios
				.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
				.then(response => {
					const cityNames = response.data.map((city: IBGECityResponse) => {
						return city.nome
					})

					setCities(cityNames)
				})
		}
	}, [selectedUf])

	function MapMarker() {
		useMapEvents({
			click(event: LeafletMouseEvent) {
				const { lat, lng } = event.latlng
				setSelectedPosition([lat, lng])
			},
		})

		return (
			selectedPosition[0] !== 0
				? <Marker interactive={false} /*icon={mapIcon}*/ position={selectedPosition} />
				: <></>
		)
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.currentTarget

		setFormData({ ...formData, [name]: value })
	}

	function handleToggleItem(id: number) {
		const alreadySelected = selectedItems.findIndex(item => item === id)

		if (alreadySelected >= 0) {
			const filteredItems = selectedItems.filter(item => item !== id)
			setSelectedItems(filteredItems)
		} else {
			setSelectedItems([...selectedItems, id])
		}
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		const data = new FormData()

		data.append('name', formData.name)
		data.append('email', formData.email)
		data.append('whatsapp', formData.whatsapp)
		data.append('uf', selectedUf)
		data.append('city', selectedCity)
		data.append('latitude', String(selectedPosition[0]))
		data.append('longitude', String(selectedPosition[1]))
		data.append('items', selectedItems.join(','))

		if (selectedFile) {
			data.append('image', selectedFile)
		}

		await api.post('/points', data)

		alert('Ponto de coleta criado')
		navigate('/')
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Ecoleta" />

				<Link to='/'>
					<FiArrowLeft />
					Voltar para home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>Cadastro do <br /> ponto de coleta</h1>

				<Dropzone onFileUploaded={setSelectedFile} />

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>
						<input
							type="text"
							name='name'
							id='name'
							onChange={handleInputChange}
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input
								type="email"
								name='email'
								id='email'
								onChange={handleInputChange}
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input
								type="text"
								name='whatsapp'
								id='whatsapp'
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>

					<MapContainer center={initialPosition} zoom={12}>
						<TileLayer
							attribution='&amp;copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<MapMarker />
					</MapContainer>

					<div className='field-group'>
						<div className="field">
							<label htmlFor="uf">Estado (UF)</label>
							<select
								name="uf"
								id="uf"
								onChange={e => setSelectedUf(e.target.value)}
								value={selectedUf}
							>
								<option value="0">Selecione uma UF</option>
								{ ufs.map(uf => <option key={uf} value={uf}>{ uf }</option>) }
							</select>
						</div>

						<div className="field">
							<label htmlFor="city">Cidade</label>
							<select
								name="city"
								id="city"
								onChange={e => setSelectedCity(e.target.value)}
								value={selectedCity}
							>
								<option value="0">Selecione uma cidade</option>
								{ cities.map(city => <option key={city} value={city}>{ city }</option>) }
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Itens de Coleta</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<ul className='items-grid'>
						{
							items.map(item => (
								<li
									key={item.id}
									onClick={() => handleToggleItem(item.id)}
									className={selectedItems.includes(item.id) ? 'selected' : 'null'}
								>
									<img src={item.image_url} alt={item.title} />
									<span>{item.title}</span>
								</li>
							))
						}
					</ul>
				</fieldset>

				<button type='submit'>
					Cadastrar ponto de coleta
				</button>
			</form>
		</div>
	)
}
