<template>
  <div>
    <h1>Bienvenido, Empleado</h1>
    <div class="employee-options">
      <router-link to="/reservas-clientes" class="option-link">
        Ver reservas de todos los clientes
      </router-link>
      <router-link to="/ingreso-sin-reserva" class="option-link">
        Ingreso sin reserva
      </router-link>
    </div>
    <!-- ...otros contenidos... -->
  </div>
</template>

<script>
export default {
  name: 'EmpleadoPage'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Contenedor principal */
div {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

div::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(30, 60, 114, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(42, 82, 152, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Título principal */
h1 {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  background: linear-gradient(135deg, #ffffff, #e6f3ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)); }
  100% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5)); }
}

/* Contenedor de opciones */
.employee-options {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
}

/* Enlaces de opciones con efecto glassmorphism */
.option-link {
  display: inline-block;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Efecto shimmer en los enlaces */
.option-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.option-link:hover::before {
  left: 100%;
}

/* Estados hover y activo */
.option-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.option-link:active {
  transform: translateY(-1px) scale(1.01);
  transition: all 0.1s ease;
}

/* Efecto de pulsación suave */
.option-link {
  animation: gentlePulse 4s ease-in-out infinite;
}

@keyframes gentlePulse {
  0%, 100% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25); }
}

/* Estilos adicionales para crear un efecto más premium */
.option-link:nth-child(1) {
  animation-delay: 0s;
}

.option-link:nth-child(2) {
  animation-delay: 0.5s;
}

/* Responsive design */
@media (max-width: 768px) {
  div {
    padding: 20px 15px;
  }

  h1 {
    font-size: 2.2rem;
    margin-bottom: 30px;
  }

  .employee-options {
    gap: 20px;
    margin-top: 30px;
  }

  .option-link {
    padding: 16px 24px;
    font-size: 15px;
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }

  .option-link {
    padding: 14px 20px;
    font-size: 14px;
  }
}

/* Efectos adicionales para crear profundidad */
.employee-options::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 2px;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2a5298, #4a90e2);
}
</style>
