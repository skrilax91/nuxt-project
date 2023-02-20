<!-- Composant servant d'overlay de chargement pour la version mobile -->

<template>
	<div class="modal-backdrop" v-if="visible">
		<div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
			<header class="modal-header" id="modalTitle">
				<slot name="header">
					{{ title }}
				</slot>
				<button type="button" class="btn-close" @click="close" aria-label="Close modal">x</button>
			</header>

			<section class="modal-body" id="modalDescription">
				<slot name="body">
					<p>{{ info }}</p>
				</slot>
			</section>

			<footer class="modal-footer">
				<slot name="footer">
					<button type="button" class="btn-darkgrey btn-valid float-left" @click="close"><Back style="fill: white"/></button>
					<button type="button" class="btn-blue btn-valid float-right" @click="submit"><tick style="fill: white"/></button>
				</slot>
			</footer>
		</div>
	</div>
</template>

<script setup lang="ts">


const visible = ref(false)
const title = ref("")
const info = ref("")

const emit = defineEmits(['close', 'submit'])
const close = () => {
  visible.value = false
  emit('close');
}

const submit = () => {
  visible.value = false
  emit('submit');
}

const show = (str: string) => {
  visible.value = true
  if (str)
    title.value = str
}

const setInfo = (msg: string) => {
  info.value = msg
}

defineExpose({
  show,
  setInfo
})

</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7)!important;
    display: flex;
    justify-content: center;
    align-items: center;
	opacity: 1!important;
}

.modal {
	max-width: 50%;
	background-color: rgba(255,255,255,1);
	box-shadow: 2px 2px 20px 1px;
	min-width: 50%;
	width: auto;
	height: auto;
	top: 15%;
	left: auto;
	overflow-x: auto;
	display: flex;
	flex-direction: column;
	opacity: 1;
	border-radius: 10px;
}

#input-1 {
	margin: 0px 50px;
	background-color: #e7ecf1;
	border: solid 1px gray;
}

#demo {
	width: 80%;
	height: 44px;
	font-size: 23px;
	margin-top: 30px;
	border-radius: 10px;
}

.modal-header,
.modal-footer {
	padding: 5px;
	display: flex;
}

.modal-header {
	position: relative;
	border-bottom: 1px solid #eeeeee;
	color: rgb(0, 106, 177);
	justify-content: space-between;
	font-size: 30px;
	text-align: center;
	padding-left: 20px;
}

.modal-header p {
	margin: 0;
}

.modal-footer {
	border-top: 1px solid #eeeeee;
	flex-direction: column;
	justify-content: flex-end;
	display: inline;
	padding-left: 40px;
	padding-right: 40px;
}

.modal-body {
	position: relative;
	padding: 20px 10px;
}

.btn-close {
	position: absolute;
	top: 0;
	right: 0;
	border: none;
	font-size: 20px;
	padding: 10px;
	cursor: pointer;
	font-weight: bold;
	color: #4AAE9B;
	background: transparent;
}

.btn-green {
	color: white;
	background: #4AAE9B;
	border: 1px solid #4AAE9B;
	border-radius: 2px;
}

.btn-darkgrey {
	color: white;
	background: rgb(68, 68, 68);
	border: 1px solid #333333;
	border-radius: 2px;
}

.btn-blue {
	color: white;
	background: rgb(0, 106, 177);
	border: 1px solid #5558fa;
	border-radius: 2px;
}

.btn-valid {
	border-radius: 50%;
	height: 70px;
	width: 70px;
}

.btn-valid svg {
	width: 80%;
	height: 80%;
}
</style>
