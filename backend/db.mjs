// Librería para SQL Server
import sql from 'mssql';

const config = {
    server: 'srvbae.database.windows.net',
    database: 'pruebas',
    user: 'userbae',
    password: 'saca28157=1028',
    port: 1433,
    options: {
        encrypt: true, // Para Azure SQL Server
        trustServerCertificate: false,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function connect() {
    try {
        if (pool) {
            return pool;
        }
        
        console.log('Conectando a SQL Server...');
        pool = await sql.connect(config);
        console.log('✅ Conexión exitosa a SQL Server');
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar a SQL Server:", error.message);
        throw error;
    }
}

// Función para ejecutar consultas de manera más fácil
async function executeQuery(query, params = []) {
    try {
        const connection = await connect();
        const request = connection.request();
        
        // Agregar parámetros si los hay
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });
        
        const result = await request.query(query);
        return result;
    } catch (error) {
        console.error("❌ Error ejecutando consulta:", error.message);
        throw error;
    }
}

// Función para cerrar la conexión
async function closeConnection() {
    try {
        if (pool) {
            await sql.close();
            pool = null;
            console.log('Conexión cerrada');
        }
    } catch (error) {
        console.error("Error cerrando conexión:", error.message);
    }
}

export default connect;
export { executeQuery, closeConnection, sql };