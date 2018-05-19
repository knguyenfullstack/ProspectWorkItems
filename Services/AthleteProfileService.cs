using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Prospect.Models.Domain.Users;
using Prospect.Services.Interfaces;
using Prospect.Models.Requests;
using Prospect.Models.Requests.Users;
using Prospect.Services.Interfaces.Users;
using Prospect.Services.Interfaces.Athletes;
using Prospect.Models.Requests.Athletes;
using Prospect.Models.Domain.Athletes;
using Prospect.Models.Responses;
using Prospect.Services.Tools;

namespace Prospect.Services.Athletes
{
    public class AthleteProfileService : BaseService, IAthleteProfileService
    {
        //GET CALL
        public List<AthleteProfile> GetAll()
        {
            List<AthleteProfile> list = new List<AthleteProfile>(); // = new List makes it an empty list
            DataProvider.ExecuteCmd("dbo.Athletes_AthleteProfile_SelectAll",
                inputParamMapper: null, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<AthleteProfile>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });
            return list; //return list to make it happy :)
        }
        //GET BY ID CALL
        public AthleteProfile GetById(int id)
        {
            AthleteProfile user = new AthleteProfile();
            DataProvider.ExecuteCmd("dbo.Athletes_AthleteProfile_SelectById",
                inputParamMapper: (SqlParameterCollection paramCollection) =>
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    user = Tools.DataMapper<AthleteProfile>.Instance.MapToObject(reader);
                });
            return user;
        }

        //POST CALL
        public int Post(AthleteProfileAddRequest model)
        {
            int id = 0;
            DataProvider.ExecuteNonQuery("dbo.Athletes_AthleteProfile_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                { // must be in the same order as our table
                    paramCollection.AddWithValue("@userBaseId", model.UserBaseId);
                    paramCollection.AddWithValue("@athleteTypeId", model.AthleteTypeId);
                    paramCollection.AddWithValue("@position", model.Position);
                    paramCollection.AddWithValue("@isProfessional", model.IsProfessional);
                    paramCollection.AddWithValue("@isValidated", model.IsValidated);
                    paramCollection.AddWithValue("@weight", model.Weight);
                    SqlParameter paramId = new SqlParameter("@id", SqlDbType.Int); // has to be sqldbtype not just int
                    paramId.Direction = ParameterDirection.Output; //changing our direction of our param to get correct info
                    paramId.Value = id;
                    paramCollection.Add(paramId);
                },
                returnParameters: delegate (SqlParameterCollection paramCollection)
                {
                    int.TryParse(paramCollection["@id"].Value.ToString(), out id); //in C# this is an object and we are converting to a string
                });
            return id;
        }



        //PUT CALL
        public void Put(AthleteProfileUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.Athletes_AthleteProfile_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    //paramCollection.AddWithValue("@userBaseId", model.UserBaseId);
                    paramCollection.AddWithValue("@athleteTypeId", model.AthleteTypeId);
                    paramCollection.AddWithValue("@position", model.Position);
                    paramCollection.AddWithValue("@isProfessional", model.IsProfessional);
                    paramCollection.AddWithValue("@isValidated", model.IsValidated);
                    paramCollection.AddWithValue("@weight", model.Weight);
                    paramCollection.AddWithValue("@id", model.Id);
                });
        }
        // DELETE CALL
        public void Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.Athletes_AthleteProfile_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);
                });
        }


        //GET NEAREST 5 ATHELETES
        public List<SingleFeaturedAthlete> GetNearbyAthletesByUserBaseId(int id)
        {
            List<SingleFeaturedAthlete> list = new List<SingleFeaturedAthlete>();

            DataProvider.ExecuteCmd("dbo.Address_GetPostalCodeByAddressId",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@id", id);
                },
                singleRecordMapper: (delegate (IDataReader reader, short set)
                {
                    list.Add(DataMapper<SingleFeaturedAthlete>.Instance.MapToObject(reader));
                }
                ));
            return list;
        }

        public List<PublicAthlete> GetNearbyAthletesByPostalCode(PublicAthleteGetRequest model)
        {
            List<PublicAthlete> list = new List<PublicAthlete>(); // = new List makes it an empty list
            DataProvider.ExecuteCmd("dbo.Athletes_SelectNearbyAthletes",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@startZip", model.StartZip);
                    paramCollection.AddWithValue("@radius", model.Radius);
                    paramCollection.AddWithValue("@numResults", model.NumResults);
                    paramCollection.AddWithValue("@userBaseId", model.UserBaseId);
                }, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<PublicAthlete>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });
            return list; //return list to make it happy :)
        }

        public List<PublicAthlete> GetRandomAthletes(PublicAthleteGetRequest model)
        {
            List<PublicAthlete> list = new List<PublicAthlete>(); // = new List makes it an empty list
            DataProvider.ExecuteCmd("dbo.Athletes_SelectRandomAthletes",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@numResults", model.NumResults);
                }, // null because we didn't put any input in our table
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<PublicAthlete>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });
            return list; //return list to make it happy :)
        }


        ///added by kenny
        public List<AthleteSearch> AthleteSearchAll(AthleteSearchGetRequest model)
        {
            List<AthleteSearch> list = new List<AthleteSearch>(); //makes a new list called 'list'
            DataProvider.ExecuteCmd("dbo.Athletes_AthleteProfile_SearchAllAthletes",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@input", model.Input);
                    parameterCollection.AddWithValue("@columnName", model.ColumnName);
                    parameterCollection.AddWithValue("@checked", model.Checked);
                    parameterCollection.AddWithValue("@PageNumber", model.PageNumber);
                    parameterCollection.AddWithValue("@recordsPerPage", model.RecordsPerPage);

                },
                singleRecordMapper: delegate (IDataReader reader, short set) // we want to map our values from our table to this class -- Delegate and => are the same thing
                {
                    list.Add(Tools.DataMapper<AthleteSearch>.Instance.MapToObject(reader)); //lets us add 1 item to the list --- we are adding 1 record(row) from our table -- it will create an object and push it into this line
                });
            return list;
        }

        //****************Added by Patric Sok ************************************
        public List<UnverifiedAthletes> GetAllUnverified(GetAthleteUnverifiedRequest model)
        {
            List<UnverifiedAthletes> list = new List<UnverifiedAthletes>();
            DataProvider.ExecuteCmd("dbo.Athletes_AthleteProfile_SelectAllUnverified",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageNumber", model.PageNumber);
                    parameterCollection.AddWithValue("@RecordsPerPage", model.RecordsPerPage);
                    parameterCollection.AddWithValue("@Input", model.Input);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    list.Add(DataMapper<UnverifiedAthletes>.Instance.MapToObject(reader));
                });
            return list;
        }

        public void UpdateVerification(AthleteProfileVerificationUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.Athletes_AthleteProfileVerification_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                 {
                  paramCollection.AddWithValue("@userBaseId", model.UserBaseId);
                  paramCollection.AddWithValue("@isProfessional", model.IsProfessional);
                  paramCollection.AddWithValue("@isValidated", model.IsValidated);
                 });
        }


        //****************Added by Patric Sok ************************************

        
        public List<RankedFeaturedAthlete> GetFeatured()
        {
            List<RankedFeaturedAthlete> list = new List<RankedFeaturedAthlete>();
            DataProvider.ExecuteCmd("dbo.Athletes_AthleteProfile_GetFeatured",

                inputParamMapper: null,
                singleRecordMapper: (IDataReader reader, short set) =>
                {
                    list.Add(DataMapper<RankedFeaturedAthlete>.Instance.MapToObject(reader));
                }

                );
            return list;
        }
    }
}
