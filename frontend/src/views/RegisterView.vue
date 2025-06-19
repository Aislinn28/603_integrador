<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ mostrarRegistro ? 'Registrarse' : 'Iniciar sesión' }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text v-if="mensajeVisible">
            <v-alert :icon="icono" :text="mensaje" title="Respuesta" :type="tipo"> </v-alert>
          </v-card-text>

          <v-card-text>
            <v-form v-model="valid">
              <template v-if="mostrarRegistro">
                <v-text-field
                  v-model="nombre"
                  label="Nombre"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="apellidos"
                  label="Apellidos"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="telefono"
                  label="Teléfono"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="usuario"
                  label="Usuario"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="contrasenia"
                  label="Contraseña"
                  type="password"
                  :rules="[rules.required]"
                  required
                />
              </template>

              <template v-else>
                <v-text-field
                  v-model="usuario"
                  label="Usuario"
                  :rules="[rules.required]"
                  required
                  prepend-icon="mdi-user"
                />
                <v-text-field
                  v-model="contrasenia"
                  label="Contraseña"
                  type="password"
                  :rules="[rules.required]"
                  required
                  prepend-icon="mdi-lock"
                />
              </template>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" @click="mostrarRegistro ? registrar() : login()">
              {{ mostrarRegistro ? 'Registrar' : 'Entrar' }}
            </v-btn>
          </v-card-actions>

          <v-card-actions class="d-flex justify-center">
            <v-btn text @click="mostrarRegistro = !mostrarRegistro">
              {{ mostrarRegistro ? '¿Ya tienes cuenta? Iniciar sesión' : 'Registrarse' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useUsuarioStore } from '@/stores/usuario_store'
import { ref } from 'vue'

const usuarioStore = useUsuarioStore()

const mostrarRegistro = ref(false)
const usuario = ref('')
const contrasenia = ref('')
const nombre = ref('')
const apellidos = ref('')
const telefono = ref('')
const valid = ref(false)
const mensaje = ref('')
const tipo = ref('')
const mensajeVisible = ref(false)
const icono = ref('')

const rules = {
  required: (value) => !!value || 'Campo requerido',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail no válido',
}

const login = async () => {
  mensajeVisible.value = false
  if (valid.value) {
    try {
      const payload = { usuario: usuario.value, contrasenia: contrasenia.value }
      const resp = await usuarioStore.login(payload)
      mensaje.value = resp.mensaje || 'Login exitoso'
      tipo.value = 'success'
      icono.value = 'mdi-check-circle'
    } catch (error) {
      mensaje.value = error.mensaje || 'Error en login'
      tipo.value = 'error'
      icono.value = 'mdi-alert-circle'
    } finally {
      mensajeVisible.value = true
    }
  }
}

const registrar = async () => {
  mensajeVisible.value = false
  if (valid.value) {
    try {
      const payload = {
        nombre: nombre.value,
        apellidos: apellidos.value,
        telefono: telefono.value,
        usuario: usuario.value,
        contrasenia: contrasenia.value,
      }
      const resp = await usuarioStore.crearUsuario(payload)
      mensaje.value = resp.mensaje || 'Usuario registrado con éxito'
      tipo.value = 'success'
      icono.value = 'mdi-check-circle'
      mostrarRegistro.value = false
    } catch (error) {
      mensaje.value = error.mensaje || 'Error en registro'
      tipo.value = 'error'
      icono.value = 'mdi-alert-circle'
    } finally {
      mensajeVisible.value = true
    }
  }
}
</script>
