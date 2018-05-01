using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using DbAccess.Tools;

namespace DbAccess.DbAdapter
{
    public class DbAdapter : IDbAdapter
    {
        //dependency injetion
        public IDbConnection Conn { get; private set; }
        public IDbCommand Cmd { get; private set; }

        public DbAdapter(IDbCommand command, IDbConnection conn)
        {
            Cmd = command;
            Conn = conn;
        }
        //this is the basics of reading sql stored proc
        public List<T> LoadObject<T>(string storedProcedure, //this function takes in a stored proc and returns an array
            IDbDataParameter[] parameters = null) where T : class//validation 
        {
            List<T> list = new List<T>();

            using (IDbConnection conn = Conn)//using is an all in one try catch finally 
            using (IDbCommand cmd = Cmd)
            {
                if (conn.State != ConnectionState.Open) //checkt the current state of the connection, if not
                    conn.Open();// open the connection
                cmd.Connection = conn;
                cmd.CommandTimeout = 5000;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = storedProcedure;
                if (parameters != null)
                {
                    foreach (IDbDataParameter parameter in parameters)
                        cmd.Parameters.Add(parameter);
                }
                IDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(DataMapper<T>.Instance.MapToObject(reader));
                }
            }

            return list;
        }


        //used for insert updates and deletes
        public int ExecuteQuery(string storedProcedure, IDbDataParameter[] parameters, Action<IDbDataParameter[]> returnParameters = null)
        {
            using (IDbConnection conn = Conn)
            using (IDbCommand cmd = Cmd)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();

                cmd.Connection = conn;
                cmd.CommandTimeout = 5000;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = storedProcedure;
                foreach (IDbDataParameter parameter in parameters)
                    cmd.Parameters.Add(parameter);

                int returnValue = cmd.ExecuteNonQuery();
                if (returnParameters != null)
                {
                    returnParameters(parameters);
                }
                return returnValue;
            }
        }


        //used to get one piece of data and define a return type
        public T ExecuteScalar<T>(string storedProcedure, IDbDataParameter[] parameters, Action<IDbDataParameter[]> returnParameters = null)
        {
            using (IDbConnection conn = Conn)
            using (IDbCommand cmd = Cmd)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();

                cmd.Connection = conn;
                cmd.CommandTimeout = 5000;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = storedProcedure;

                foreach (IDbDataParameter parameter in parameters)
                    cmd.Parameters.Add(parameter);

                object obj = cmd.ExecuteScalar();

                return (T)obj;
            }
        }


    }
}
