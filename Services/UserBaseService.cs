using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Prospect.Models.Domain;
using Prospect.Services.Interfaces;
using Prospect.Models.Requests;
using Prospect.Models.Requests.Users;
using Prospect.Services.Interfaces.Users;
using Prospect.Models.Domain.Users;

namespace Prospect.Services.Users
{
    public class UserBaseService : BaseService, IUserBaseService
    {
        //GET CALL
        public List<UserBase> GetAll()
        {
            List<UserBase> list = new List<UserBase>(); // = new List makes it an empty list
            DataProvider.ExecuteCmd("dbo.Users_UserBase_SelectAll",
                inputParamMapper: null, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<UserBase>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });
            return list; //return list to make it happy :)
        }
        //GET BY ID CALL
        public UserBase GetById(int id)
        {
            UserBase user = new UserBase();
            DataProvider.ExecuteCmd("dbo.Users_UserBase_SelectById",
                inputParamMapper: (SqlParameterCollection paramCollection) =>
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    user = Tools.DataMapper<UserBase>.Instance.MapToObject(reader);
                });
            return user;
        }
        //POST CALL
        public string Registration(UserBaseAddRequest model)
        //public int Registration(UserBaseAddRequest model)
        {
            //int id = 0;
            string Token = "";
            DataProvider.ExecuteNonQuery("dbo.Users_UserBase_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@email", model.Email);
                    paramCollection.AddWithValue("@passwordHash", model.PasswordHash);
                    paramCollection.AddWithValue("@salt", model.Salt);
                    paramCollection.AddWithValue("@role", model.Role);
                    paramCollection.AddWithValue("@postalCode", model.PostalCode);
                    paramCollection.AddWithValue("@firstName", model.FirstName);
                    paramCollection.AddWithValue("@middleName", model.MiddleName);
                    paramCollection.AddWithValue("@lastName", model.LastName);
                    paramCollection.AddWithValue("@dateOfBirth", model.DateOfBirth);
                    paramCollection.AddWithValue("@gender", model.Gender);
                    paramCollection.AddWithValue("@athleteTypeId", model.AthleteTypeId);
                    SqlParameter paramId = new SqlParameter("@Token", SqlDbType.NVarChar, 128); // has to be sqldbtype not just int
                    //SqlParameter paramId = new SqlParameter("@id", SqlDbType.Int); // has to be sqldbtype not just int
                    paramId.Direction = ParameterDirection.Output; //changing our direction of our param to get correct info
                    //paramId.Value = id;
                    paramId.Value = Token;

                    paramCollection.Add(paramId);
                },

            returnParameters: delegate (SqlParameterCollection paramCollection)
            {
                Token = paramCollection["@Token"].Value.ToString();
            });
            return Token;
        }
        //PUT CALL
        public void Put(UserBaseUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.Users_UserBase_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@email", model.Email);
                    paramCollection.AddWithValue("@passwordHash", model.PasswordHash);
                    paramCollection.AddWithValue("@salt", model.Salt);
                    paramCollection.AddWithValue("@isEmailConfirmed", model.IsEmailConfirmed);
                    paramCollection.AddWithValue("@isAccountLocked", model.IsAccountLocked);
                    paramCollection.AddWithValue("@loginAttempts", model.LoginAttempts);
                    paramCollection.AddWithValue("@id", model.Id);
                });
        }
        // DELETE CALL
        public void Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.Users_UserBase_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);
                });
        }
        public UserBase GetByEmail(string email)
        {
            UserBase user = new UserBase();
            List<string> list = new List<string>();
            DataProvider.ExecuteCmd("dbo.Users_UserBase_SelectAllByEmail",
                inputParamMapper: (SqlParameterCollection paramCollection) =>
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@Email", email);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (set == 0)
                    {
                        user = Tools.DataMapper<UserBase>.Instance.MapToObject(reader);
                    }
                    if (set == 1)
                    {

                        list.Add(reader["RoleName"].ToString());
                    }
                    //user = Tools.DataMapper<UserBase>.Instance.MapToObject(reader);
                });
            user.Roles = list;
            return user;
            
        }

        /// <summary>
        /// 
        /// 
        /// check if token is valid by checking if the token exists
        /// if it does exists then change the state of the user from 
        /// invalid to valid and locked to unlocked
        /// </summary>
        /// 
        public bool CheckIfTokenIsValid(string token)
        {
            bool isValid = false;
            DataProvider.ExecuteNonQuery("dbo.Users_UserBase_UpdateisEmailConfirmed",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@token", token);
                    SqlParameter paramId = new SqlParameter("@isValid", SqlDbType.Bit); //declaring parameter that sql needs to output by setting it to paramId
                    paramId.Direction = ParameterDirection.Output;//set that paramId to the output of the sql stored proceedure
                    paramCollection.Add(paramId);//add the param to the paramCollection
                },
                returnParameters: delegate (SqlParameterCollection paramCollection)
                {
                //get output of the service and turn it into a string and then convert to a bool and return
                bool.TryParse(paramCollection["@isValid"].Value.ToString(), out isValid);
                });
            return isValid;
        }

        public List<UserTags> GetAllUserTags()
        {
            List<UserTags> list = new List<UserTags>(); // = new List makes it an empty list

            DataProvider.ExecuteCmd("dbo.Users_SelectAllUserNames",
                inputParamMapper: null, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<UserTags>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });

            return list; //return list to make it happy :)
        }

        public List<string> GetUserRoles(int id)
        {
            List<string> list = new List<string>(); // = new List makes it an empty list

            DataProvider.ExecuteCmd("dbo.Users_Users_SelectUserRolesById",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);

                }, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(reader["RoleName"].ToString()); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });

            return list; //return list to make it happy :)
        }

        public string GetDashboardOrder(int id)
        {
            string order = "";

            DataProvider.ExecuteCmd("dbo.Users_DashboardOrder_SelectByUserBaseId",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);

                }, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    order = reader["DashboardOrder"].ToString(); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });

            return order; //return list to make it happy :)
        }

        public void UpdateDashboardOrder(int id, string order)
        {

            DataProvider.ExecuteNonQuery("dbo.Users_DashboardOrder_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@userbaseId", id);
                    paramCollection.AddWithValue("@dashboardOrder", order);

                });
        }
        public string GetRegTokenByEmail(UserBaseAddRequest model)
        {
            string Token = "";
            DataProvider.ExecuteNonQuery("dbo.Apps_AppToken_SelectRegistrationTokenByEmail",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@email", model.Email);
                    SqlParameter paramId = new SqlParameter("@Token", SqlDbType.NVarChar, 128); // has to be sqldbtype not just int
                    //SqlParameter paramId = new SqlParameter("@id", SqlDbType.Int); // has to be sqldbtype not just int
                    paramId.Direction = ParameterDirection.Output; //changing our direction of our param to get correct info
                    //paramId.Value = id;
                    paramId.Value = Token;

                    paramCollection.Add(paramId);
                },

            returnParameters: delegate (SqlParameterCollection paramCollection)
            {
                Token = paramCollection["@Token"].Value.ToString();
            });

            return Token;
        }
    }
}
