(function(wp, $) {
	'use strict';
	var el = wp.element.createElement;
	var i18n = window.luiz0067_carousel_i18n || {};
	function __(key, fallback) {
		return (i18n && i18n[key]) ? i18n[key] : (fallback || key);
	}

	function getRandomArbitrary(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}
	function getNewIdCarousel(){
		var id = 'carousel' + getRandomArbitrary(0, 1000);	
		while ($("#" + id).length === 1) {
			id = 'carousel' + getRandomArbitrary(0, 1000);
		}
		return id;
	}

	wp.blocks.registerBlockType('luiz0067/carousel-slides', {
	title: __('block_title', 'luiz0067 Carousel Slides'),		// Block name visible to user
	icon: 'slides',	// Toolbar icon can be either using WP Dashicons or custom SVG
	category: 'media',	// Under which category the block would appear
	description: __('block_description', 'Inserir as imagens para apresentação do slide show'),
	
	supports: {
		multiple: true,
	},
	example: {
		attributes: {
			id: 'carousel-template',
			url: [
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231e3c72'/%3E%3Cstop offset='100%25' stop-color='%232a5298'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g1)'/%3E%3Ccircle cx='400' cy='225' r='70' fill='rgba(255,255,255,0.1)'/%3E%3Cpolygon points='380,195 435,225 380,255' fill='rgba(255,255,255,0.7)'/%3E%3C/svg%3E",
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236a11cb'/%3E%3Cstop offset='100%25' stop-color='%232575fc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g2)'/%3E%3Ccircle cx='400' cy='225' r='70' fill='rgba(255,255,255,0.1)'/%3E%3Cpolygon points='380,195 435,225 380,255' fill='rgba(255,255,255,0.7)'/%3E%3C/svg%3E"
			],
			title: [
				__('example_slide_1_title', 'Slide 1'),
				__('example_slide_2_title', 'Slide 2')
			],
			description: [
				__('example_slide_1_desc', '<p>Descrição do Slide 1</p>'),
				__('example_slide_2_desc', '<p>Descrição do Slide 2</p>')
			],
			objectFit: [
				'cover',
				'cover'
			],
			objectPosition: [
				'center center',
				'center center'
			]
		}
	},
	attributes: {			// The data this block will be storing
		id: { 
			type: 'string',
			default: ''
		},
		url: { 
			type: 'array',
			default: []
		},
		title: { 
			type: 'array',
			default: []
		},
		description: { 
			type: 'array',
			default: []
		},
		objectFit: {
			type: 'array',
			default: []
		},
		objectPosition: {
			type: 'array',
			default: []
		}
	},
	edit: function(props) {
		var useState = (window.wp && wp.element && wp.element.useState) ? wp.element.useState : null;
		var activeState = useState ? useState(0) : [0, function(){}];
		var currentActiveSlide = activeState[0];
		var setCurrentActiveSlide = activeState[1];

		var acc_url = props.attributes.url || [];
		var acc_title = props.attributes.title || [];
		var acc_description = props.attributes.description || [];

		if (!props.attributes.id || acc_url.length === 0 || acc_title.length === 0) {	
			var initial_title = [];
			var initial_url = [];
			var initial_description = [];
			var initial_object_fit = [];
			var initial_object_position = [];

			if (!props.attributes.id) {
				props.setAttributes({ id: getNewIdCarousel() });
			}

			var gallery_items_frame = wp.media.frames.gallery_items = wp.media({
				title: __('media_title', 'Selecione seu anexo'),
				button: {
					text: __('media_button', 'linkar anexo')
				},
				states: [
					new wp.media.controller.Library({
						title: __('media_button', 'linkar anexo'),
						filterable: 'all',
						multiple: true
					})
				]
			});

			gallery_items_frame.on('close', function() {
				var selection = gallery_items_frame.state().get('selection');
				selection.each(function(attachment) {
					initial_title.push(attachment.attributes.title || '');
					initial_url.push(attachment.attributes.url || '');
					initial_description.push(attachment.attributes.caption || '');
					initial_object_fit.push('cover');
					initial_object_position.push('center center');
				});
				if (selection.length > 0) {
					props.setAttributes({
						title: initial_title,
						url: initial_url,
						description: initial_description,
						objectFit: initial_object_fit,
						objectPosition: initial_object_position
					});
				}
			});
			gallery_items_frame.open();
		}

		function updateURl(position) {
			var frame = wp.media({
				title: __('media_title', 'Selecione seu anexo'),
				button: {
					text: __('media_button', 'linkar anexo')
				},
				states: [
					new wp.media.controller.Library({
						title: __('media_button', 'linkar anexo'),
						filterable: 'all',
						multiple: false
					})
				]
			});

			frame.on('close', function() {
				var selection = frame.state().get('selection');
				if (selection.length > 0) {
					var attachment = selection.first();
					var new_title = [...(props.attributes.title || [])];
					var new_url = [...(props.attributes.url || [])];
					var new_description = [...(props.attributes.description || [])];

					new_title[position] = attachment.attributes.title || '';
					new_url[position] = attachment.attributes.url || '';
					new_description[position] = attachment.attributes.caption || '';

					props.setAttributes({
						title: new_title,
						url: new_url,
						description: new_description
					});
				}
			});
			frame.open();
		}
		
		function updateTitle(position, value) {
			if (value.length <= 50) {
				var new_title = [...(props.attributes.title || [])];
				new_title[position] = value;
				props.setAttributes({ title: new_title });
			}
		}
		
		function updateDescription(position, newdata) {
			var newdatastr = (newdata || '').toString();
			var plainText = newdatastr.replace(/<\/?[^>]+(>|$)/g, "");
			if (plainText.length <= 100) {
				var new_description = [...(props.attributes.description || [])];
				new_description[position] = newdata;
				props.setAttributes({ description: new_description });
			}
		}

		function updateObjectFit(position, value) {
			var new_object_fit = Array.isArray(props.attributes.objectFit) ? [...props.attributes.objectFit] : [];
			var currentTotal = (props.attributes.url || []).length;
			while (new_object_fit.length < currentTotal) {
				new_object_fit.push('cover');
			}
			new_object_fit[position] = value;
			props.setAttributes({ objectFit: new_object_fit });
		}

		function updateObjectPosition(position, value) {
			var new_object_position = Array.isArray(props.attributes.objectPosition) ? [...props.attributes.objectPosition] : [];
			var currentTotal = (props.attributes.url || []).length;
			while (new_object_position.length < currentTotal) {
				new_object_position.push('center center');
			}
			new_object_position[position] = value;
			props.setAttributes({ objectPosition: new_object_position });
		}
		
		function addlinkdata(position) {
			var frame = wp.media({
				title: __('media_title', 'Selecione seu anexo'),
				button: {
					text: __('media_button', 'linkar anexo')
				},
				states: [
					new wp.media.controller.Library({
						title: __('media_button', 'linkar anexo'),
						filterable: 'all',
						multiple: true
					})
				]
			});

			frame.on('close', function() {
				var selection = frame.state().get('selection');
				if (selection.length > 0) {
					var new_title = [...(props.attributes.title || [])];
					var new_url = [...(props.attributes.url || [])];
					var new_description = [...(props.attributes.description || [])];
					var new_object_fit = Array.isArray(props.attributes.objectFit) ? [...props.attributes.objectFit] : [];
					var new_object_position = Array.isArray(props.attributes.objectPosition) ? [...props.attributes.objectPosition] : [];
					var insertIndex = position + 1;

					while (new_object_fit.length < new_url.length) {
						new_object_fit.push('cover');
					}
					while (new_object_position.length < new_url.length) {
						new_object_position.push('center center');
					}

					selection.each(function(attachment) {
						new_title.splice(insertIndex, 0, attachment.attributes.title || '');
						new_url.splice(insertIndex, 0, attachment.attributes.url || '');
						new_description.splice(insertIndex, 0, attachment.attributes.caption || '');
						new_object_fit.splice(insertIndex, 0, 'cover');
						new_object_position.splice(insertIndex, 0, 'center center');
						insertIndex++;
					});

					if (setCurrentActiveSlide) {
						setCurrentActiveSlide(insertIndex - 1);
					}

					props.setAttributes({
						title: new_title,
						url: new_url,
						description: new_description,
						objectFit: new_object_fit,
						objectPosition: new_object_position
					});
				}
			});
			frame.open();
		}
			
		function removelinkdata(position) {
			var new_url = [...(props.attributes.url || [])];
			var new_title = [...(props.attributes.title || [])];
			var new_description = [...(props.attributes.description || [])];
			var new_object_fit = Array.isArray(props.attributes.objectFit) ? [...props.attributes.objectFit] : [];
			var new_object_position = Array.isArray(props.attributes.objectPosition) ? [...props.attributes.objectPosition] : [];

			if (new_url.length > 1) {
				new_url.splice(position, 1);
				new_title.splice(position, 1);
				new_description.splice(position, 1);
				if (new_object_fit.length > position) {
					new_object_fit.splice(position, 1);
				}
				if (new_object_position.length > position) {
					new_object_position.splice(position, 1);
				}

				if (setCurrentActiveSlide && currentActiveSlide >= new_url.length) {
					setCurrentActiveSlide(new_url.length - 1);
				}

				props.setAttributes({
					url: new_url,
					title: new_title,
					description: new_description,
					objectFit: new_object_fit,
					objectPosition: new_object_position
				});
			}
		}

		var RichTextComponent = (window.wp && wp.blockEditor && wp.blockEditor.RichText) 
			? wp.blockEditor.RichText 
			: (window.wp && wp.editor && wp.editor.RichText ? wp.editor.RichText : 'div');

		var urls = props.attributes.url || [];
		var titles = props.attributes.title || [];
		var descriptions = props.attributes.description || [];
		var sizelines = urls.length;

		if (currentActiveSlide >= sizelines && sizelines > 0) {
			currentActiveSlide = sizelines - 1;
		}

		var currIdx = currentActiveSlide;
		var _backgroundImage = (urls[currIdx]) ? ("url(" + urls[currIdx] + ")") : "none";

		var InspectorControls = (window.wp && wp.blockEditor && wp.blockEditor.InspectorControls) 
			? wp.blockEditor.InspectorControls 
			: (window.wp && wp.editor && wp.editor.InspectorControls ? wp.editor.InspectorControls : null);
		var PanelBody = (window.wp && wp.components && wp.components.PanelBody) ? wp.components.PanelBody : null;
		var SelectControl = (window.wp && wp.components && wp.components.SelectControl) ? wp.components.SelectControl : null;

		function getObjectFit(position) {
			if (Array.isArray(props.attributes.objectFit) && props.attributes.objectFit[position] !== undefined) {
				return props.attributes.objectFit[position] || 'cover';
			}
			if (typeof props.attributes.objectFit === 'string' && props.attributes.objectFit) {
				return props.attributes.objectFit;
			}
			return 'cover';
		}

		function getObjectPosition(position) {
			if (Array.isArray(props.attributes.objectPosition) && props.attributes.objectPosition[position] !== undefined) {
				return props.attributes.objectPosition[position] || 'center center';
			}
			if (typeof props.attributes.objectPosition === 'string' && props.attributes.objectPosition) {
				return props.attributes.objectPosition;
			}
			return 'center center';
		}

		var objectFitVal = getObjectFit(currIdx);
		var objectPositionVal = getObjectPosition(currIdx);
		var bgSizeMapping = {
			'cover': 'cover',
			'contain': 'contain',
			'fill': '100% 100%',
			'none': 'auto',
			'scale-down': 'contain'
		};
		var currentBgSize = bgSizeMapping[objectFitVal] || 'cover';

		var sidebarInspector = (InspectorControls && PanelBody && SelectControl) ? el(InspectorControls, {},
			el(PanelBody, { title: 'Configurações do Slide ' + (currIdx + 1), initialOpen: true },
				el(SelectControl, {
					label: 'Ajuste da Imagem (object-fit)',
					value: objectFitVal,
					options: [
						{ label: 'cover (Cobrir tela - padrão)', value: 'cover' },
						{ label: 'contain (Conter imagem inteira)', value: 'contain' },
						{ label: 'fill (Preencher esticando)', value: 'fill' },
						{ label: 'scale-down (Reduzir proporcional)', value: 'scale-down' },
						{ label: 'none (Tamanho original sem ajuste)', value: 'none' }
					],
					onChange: function(newFit) {
						updateObjectFit(currIdx, newFit);
					}
				}),
				el(SelectControl, {
					label: 'Posição da Imagem (object-position)',
					value: objectPositionVal,
					options: [
						{ label: 'top left (Topo Esquerda)', value: 'top left' },
						{ label: 'top center (Topo Centro)', value: 'top center' },
						{ label: 'top right (Topo Direita)', value: 'top right' },
						{ label: 'center left (Centro Esquerda)', value: 'center left' },
						{ label: 'center center (Centro - padrão)', value: 'center center' },
						{ label: 'center right (Centro Direita)', value: 'center right' },
						{ label: 'bottom left (Base Esquerda)', value: 'bottom left' },
						{ label: 'bottom center (Base Centro)', value: 'bottom center' },
						{ label: 'bottom right (Base Direita)', value: 'bottom right' }
					],
					onChange: function(newPos) {
						updateObjectPosition(currIdx, newPos);
					}
				})
			)
		) : null;

		var descField = el('textarea', {
			key: 'desc-field-' + currIdx,
			className: 'color-1 w-100 text-center text-break carousel-desc',
			rows: 2,
			maxLength: 100,
			value: descriptions[currIdx] || '',
			onChange: function(e) {
				updateDescription(currIdx, e.target.value);
			},
			placeholder: 'Coloque seu texto aqui até 100 caracteres...',
			style: { 
				color: "#f0f0f0", 
				textShadow: "1px 1px 8px rgba(0, 0, 0, 0.8)", 
				backgroundColor: "transparent", 
				border: "none", 
				outline: "none", 
				resize: "none", 
				width: "100%", 
				textAlign: "center", 
				fontFamily: "inherit", 
				fontSize: "0.95rem", 
				lineHeight: "1.4", 
				padding: "0", 
				margin: "0 auto"
			}
		});

		var photos_editor = [
			el('div',
				{ 
					key: 'slide-item-' + currIdx,
					className: 'carousel-item rounded active',
					style: { 
						width: "100%", 
						height: "100%", 
						"background-image": _backgroundImage, 
						"background-size": currentBgSize, 
						"background-repeat": "no-repeat",
						"background-position": objectPositionVal,
						objectFit: objectFitVal,
						objectPosition: objectPositionVal,
						display: "block"
					}
				},
				el('div', {
					className: 'btn-group shadow-sm',
					style: { position: 'absolute', top: '15px', left: '15px', zIndex: 10000, borderRadius: '6px', overflow: 'hidden' }
				},
					el('button', {
						key: 'btn-add-' + currIdx,
						type: 'button', 							
						className: 'btn btn-primary btn-sm',
						title: "Adicionar Novo Slide",
						onClick: function() { addlinkdata(currIdx); },
						style: { width: '36px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
					}, 
						el('i', { className: "fas fa-plus", 'aria-hidden': 'true' })
					),
					el('button',
						{
							key: 'btn-img-' + currIdx,
							type: 'button',
							className: 'btn btn-success btn-sm',
							title: 'Editar Imagem do Slide',
							style: { width: '36px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
							onClick: function() { updateURl(currIdx); }
						},
						el('i', { className: "fas fa-pencil-alt", 'aria-hidden': 'true' })
					),
					el('select', {
						key: 'select-fit-' + currIdx,
						className: 'form-select form-select-sm bg-dark text-white border-0',
						style: {
							height: '32px',
							fontSize: '12px',
							cursor: 'pointer',
							padding: '2px 24px 2px 8px',
							borderRadius: '0',
							outline: 'none',
							boxShadow: 'none',
							width: 'auto'
						},
						title: 'Ajuste da Imagem (object-fit)',
						value: objectFitVal,
						onChange: function(e) {
							updateObjectFit(currIdx, e.target.value);
						}
					},
						el('option', { value: 'cover' }, 'Cover'),
						el('option', { value: 'contain' }, 'Contain'),
						el('option', { value: 'fill' }, 'Fill'),
						el('option', { value: 'scale-down' }, 'Scale-down'),
						el('option', { value: 'none' }, 'None')
					),
					el('select', {
						key: 'select-pos-' + currIdx,
						className: 'form-select form-select-sm bg-dark text-white border-0',
						style: {
							height: '32px',
							fontSize: '12px',
							cursor: 'pointer',
							padding: '2px 24px 2px 8px',
							borderRadius: '0',
							outline: 'none',
							boxShadow: 'none',
							width: 'auto'
						},
						title: 'Posição da Imagem (object-position)',
						value: objectPositionVal,
						onChange: function(e) {
							updateObjectPosition(currIdx, e.target.value);
						}
					},
						el('option', { value: 'top left' }, 'Top Left'),
						el('option', { value: 'top center' }, 'Top Center'),
						el('option', { value: 'top right' }, 'Top Right'),
						el('option', { value: 'center left' }, 'Center Left'),
						el('option', { value: 'center center' }, 'Center Center'),
						el('option', { value: 'center right' }, 'Center Right'),
						el('option', { value: 'bottom left' }, 'Bottom Left'),
						el('option', { value: 'bottom center' }, 'Bottom Center'),
						el('option', { value: 'bottom right' }, 'Bottom Right')
					),
					el('button', {
						key: 'btn-remove-' + currIdx,
						type: 'button', 							
						className: 'btn btn-danger btn-sm',
						title: "Excluir Slide Atual",
						onClick: function() { removelinkdata(currIdx); },
						style: { width: '36px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
					}, 
						el('i', { className: "fas fa-times", 'aria-hidden': 'true' })
					)
				),
				el('div', {
					className: 'badge bg-dark bg-opacity-75 shadow-sm',
					style: { 
						position: 'absolute', 
						top: '15px', 
						right: '15px', 
						zIndex: 10000, 
						padding: '7px 12px', 
						fontSize: '13px', 
						borderRadius: '6px',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '6px'
					}
				}, 
					el('i', { className: 'fas fa-images', 'aria-hidden': 'true' }),
					el('span', {}, 'Slide ' + (currIdx + 1) + ' - ' + (sizelines || 1))
				),
				el('div', 
					{ 
						key: 'caption-' + currIdx,
						className: 'carousel-caption w-100 text-center',
						style: { 
							bottom: "0px", 
							left: "0px", 
							right: "0px", 
							width: "100%", 
							background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.88) 100%)", 
							padding: "30px 25px 40px 25px", 
							borderRadius: "0 0 8px 8px",
							zIndex: 1000
						}
					},
					el('h4', 
						{
							key: 'h4-title-' + currIdx,
							className: 'color-1 w-100 text-center text-break',
							style: { textShadow: "2px 2px 10px #000000", margin: "0 auto 6px auto" }
						},
						el('input', {
							key: 'input-title-' + currIdx,
							type: 'text',
							className: 'color-1 w-100 text-center',
							onChange: function(e) { updateTitle(currIdx, e.target.value); },
							style: { 
								color: "#ffffff", 
								backgroundColor: "transparent", 
								border: "none", 
								outline: "none", 
								textAlign: "center", 
								fontFamily: "inherit", 
								fontSize: "inherit", 
								fontWeight: "bold", 
								textShadow: "inherit", 
								padding: "0", 
								width: "100%"
							},
							value: titles[currIdx] || '',
							placeholder: 'Coloque seu título aqui até 50 caracteres...'
						})
					),
					descField
				)
			)
		];

		var buttons_editor = [];
		for (var b = 0; b < sizelines; b++) {
			(function(bIdx) {
				buttons_editor.push(
					el('button', { 
						key: 'indicator-btn-' + bIdx,
						type: 'button',
						onClick: function(e) {
							e.preventDefault();
							if (setCurrentActiveSlide) {
								setCurrentActiveSlide(bIdx);
							}
						},
						className: (bIdx === currIdx) ? "active" : "",
						'aria-current': (bIdx === currIdx) ? 'true' : undefined,
						'aria-label': (titles[bIdx] ? titles[bIdx] : 'Slide ' + (bIdx + 1)) + " "
					})
				);
			})(b);
		}
		
		var mainCarousel = el('div', { className: "w-100 slide-show-block" },
			el('div', { className: "rounded", style: { width: "80%", overflowX: "hidden", marginLeft: "auto", marginRight: "auto" } },
				el('div', 
					{ 
						id: props.attributes.id,
						className: 'carousel slide mx-auto',
						style: { width: "100%", paddingTop: "50%", minWidth: "280px", "margin-bottom": "calc(170px - 6vw)", position: "relative" }
					},
					el('div', { className: 'carousel-indicators', style: { zIndex: 10002 } }, buttons_editor),
					el('div', 
						{ 
							className: 'carousel-inner',					
							style: { height: '100%', width: "100%", position: "absolute", top: "0px", overflow: "visible" }
						},
						photos_editor
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-prev',
							title: 'Slide Anterior',
							style: {
								position: 'absolute',
								top: '50%',
								left: '15px',
								transform: 'translateY(-50%)',
								width: '42px',
								height: '42px',
								borderRadius: '50%',
								backgroundColor: 'rgba(0, 0, 0, 0.65)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								zIndex: 10005,
								opacity: 1
							},
							onClick: function(e) {
								e.preventDefault();
								if (setCurrentActiveSlide && sizelines > 0) {
									setCurrentActiveSlide((currentActiveSlide - 1 + sizelines) % sizelines);
								}
							}
						},
						el('i', { className: 'fas fa-chevron-left text-white', style: { fontSize: '18px', color: '#ffffff' }, 'aria-hidden': 'true' })
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-next',
							title: 'Próximo Slide',
							style: {
								position: 'absolute',
								top: '50%',
								right: '15px',
								transform: 'translateY(-50%)',
								width: '42px',
								height: '42px',
								borderRadius: '50%',
								backgroundColor: 'rgba(0, 0, 0, 0.65)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								zIndex: 10005,
								opacity: 1
							},
							onClick: function(e) {
								e.preventDefault();
								if (setCurrentActiveSlide && sizelines > 0) {
									setCurrentActiveSlide((currentActiveSlide + 1) % sizelines);
								}
							}
						},
						el('i', { className: 'fas fa-chevron-right text-white', style: { fontSize: '18px', color: '#ffffff' }, 'aria-hidden': 'true' })
					)
				)
			)
		); 

		return sidebarInspector 
			? el(wp.element.Fragment, {}, sidebarInspector, mainCarousel)
			: mainCarousel;
	},	
	
	save: function(props) {
		var urls = props.attributes.url || [];
		var titles = props.attributes.title || [];
		var descriptions = props.attributes.description || [];
		var sizelines = urls.length;
		var photos_editor = [];

		var bgSizeMapping = {
			'cover': 'cover',
			'contain': 'contain',
			'fill': '100% 100%',
			'none': 'auto',
			'scale-down': 'contain'
		};

		for (var index = 0; index < sizelines; index++) {  
			var active = (index === 0) ? "active" : "";
			var _backgroundImage = "url(" + (urls[index] || "") + ")";
			var descHtml = descriptions[index] || '';

			var objectFitVal = 'cover';
			if (Array.isArray(props.attributes.objectFit) && props.attributes.objectFit[index] !== undefined) {
				objectFitVal = props.attributes.objectFit[index] || 'cover';
			} else if (typeof props.attributes.objectFit === 'string' && props.attributes.objectFit) {
				objectFitVal = props.attributes.objectFit;
			}

			var objectPositionVal = 'center center';
			if (Array.isArray(props.attributes.objectPosition) && props.attributes.objectPosition[index] !== undefined) {
				objectPositionVal = props.attributes.objectPosition[index] || 'center center';
			} else if (typeof props.attributes.objectPosition === 'string' && props.attributes.objectPosition) {
				objectPositionVal = props.attributes.objectPosition;
			}

			var currentBgSize = bgSizeMapping[objectFitVal] || 'cover';

			photos_editor.push(
				el('div',
					{ 
						className: 'carousel-item rounded ' + active,
						style: { 
							width: "100%", 
							height: "100%", 
							"background-image": _backgroundImage, 
							"background-size": currentBgSize, 
							"background-repeat": "no-repeat",
							"background-position": objectPositionVal,
							objectFit: objectFitVal,
							objectPosition: objectPositionVal
						}
					},
					el('div', 
						{ 
							className: 'carousel-caption w-100 text-center',
							style: { 
								bottom: "0px", 
								left: "0px", 
								right: "0px", 
								width: "100%", 
								background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.88) 100%)", 
								padding: "30px 25px 40px 25px", 
								borderRadius: "0 0 8px 8px"
							}
						},
						el('h4', 
							{
								className: 'color-1 w-100 text-center text-break',
								style: { color: "#ffffff", textShadow: "2px 2px 10px #000000", margin: "0 auto 6px auto", fontWeight: "bold" }
							},
							titles[index] || ''
						),
						el('div',
							{
								className: 'color-1 w-100 text-center text-break carousel-desc',
								style: { color: "#f0f0f0", textShadow: "1px 1px 8px rgba(0, 0, 0, 0.8)", backgroundColor: "transparent", fontSize: "0.95rem", lineHeight: "1.4", textAlign: "center" }
							},
							(typeof window.HTMLReactParser === 'function') 
								? window.HTMLReactParser(descHtml) 
								: el(wp.element.RawHTML, {}, descHtml)
						)
					)
				)
			);
		}
		
		var buttons_editor = [];
		for (var bIdx = 0; bIdx < sizelines; bIdx++) {  
			buttons_editor.push(
				el('button',
					{ 
						type: 'button',
						'data-bs-target': '#' + (props.attributes.id || ''),
						'data-bs-slide-to': bIdx,
						className: (bIdx === 0) ? "active" : "",
						'aria-current': (bIdx === 0) ? 'true' : undefined,
						'aria-label': (titles[bIdx] ? titles[bIdx] : 'Slide ' + (bIdx + 1)) + " "
					}
				)
			);
		}
		
		return el('div', { className: "w-100 slide-show-block " },
			el('div', { className: "rounded", style: { width: "80%", overflowX: "hidden", marginLeft: "auto", marginRight: "auto" } },
				el('div', 
					{ 
						id: props.attributes.id,
						className: 'carousel slide mx-auto',
						style: { width: "100%", paddingTop: "50%", minWidth: "280px", "margin-bottom": "calc(170px - 6vw)" },
						'data-bs-ride': 'carousel'
					},
					el('div', { className: 'carousel-indicators' }, buttons_editor),
					el('div', 
						{ 
							className: 'carousel-inner',					
							style: { height: '100%', width: "100%", position: "absolute", top: "0px", overflow: "visible" }
						},
						photos_editor
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-prev',
							'data-bs-target': '#' + props.attributes.id,
							'data-bs-slide': 'prev'
						},
						el('span', { className: 'carousel-control-prev-icon', 'aria-hidden': 'true' })
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-next',
							'data-bs-target': '#' + props.attributes.id,
							'data-bs-slide': 'next'
						},
						el('span', { className: 'carousel-control-next-icon', 'aria-hidden': 'true' })
					)
				)
			)
		);  
	});
})(window.wp, window.jQuery);



