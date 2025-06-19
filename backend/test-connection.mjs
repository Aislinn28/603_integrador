import connect from './db.mjs';
import sql from 'mssql';

async function testConnection() {
    console.log('🔄 Probando conexión a SQL Server...\n');
    
    try {
        // Probar conexión
        const pool = await connect();
        console.log('✅ Conexión establecida correctamente');
        
        // Hacer una consulta simple
        const result = await pool.request().query('SELECT GETDATE() as fecha_actual');
        console.log('✅ Consulta exitosa:', result.recordset[0]);
        
        // Verificar base de datos
        const dbResult = await pool.request().query('SELECT DB_NAME() as database_name');
        console.log('✅ Base de datos actual:', dbResult.recordset[0].database_name);
        
        console.log('\n🎉 ¡Conexión exitosa! Tu aplicación puede conectarse a SQL Server');
        
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('\n🔧 Posibles soluciones:');
        console.error('1. Verifica que tu IP esté en el firewall de Azure');
        console.error('2. Confirma que el servidor esté activo');
        console.error('3. Revisa las credenciales');
    } finally {
        // Cerrar conexión
        await sql.close();
        console.log('\n👋 Conexión cerrada');
    }
}

testConnection();