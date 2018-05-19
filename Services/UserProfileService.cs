using Prospect.Models.Domain.Users;
using Prospect.Models.Requests.Users;
using Prospect.Models.Responses;
using Prospect.Services.Interfaces.Users;
using Prospect.Services.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Prospect.Services.Users
{
    public class UserProfileService : BaseService, IUserProfileService
    {
      
        //GET ALL USERS PROFILE
        public List<UserProfile> GetAll()
        {
            List<UserProfile> list = new List<UserProfile>();

            DataProvider.ExecuteCmd("dbo.Users_UserProfile_SelectAll",
               inputParamMapper: null,
               singleRecordMapper: delegate (IDataReader reader, short set)
               {
                   list.Add(Tools.DataMapper<UserProfile>.Instance.MapToObject(reader));
               });

            return list;
        }
        //GET USER BY ID
        public UserProfile GetById(int id)
        {
            UserProfile item = new UserProfile();

            DataProvider.ExecuteCmd("dbo.Users_UserProfile_SelectById",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    item = Tools.DataMapper<UserProfile>.Instance.MapToObject(reader);
                });
            return item;
        }

        //GET CURRENT USER 
        public PublicProfileResponse GetByUserBaseId(int userBaseId)
        {
            PublicProfileResponse currentUser = new PublicProfileResponse();

            DataProvider.ExecuteCmd("dbo.Users_PublicProfile_SelectByUserBaseId",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserBaseId", userBaseId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    currentUser = DataMapper<PublicProfileResponse>.Instance.MapToObject(reader);
                });
            return currentUser;
        }


        //PUT NEW USER
        public void Put(UserProfileUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.Users_UserProfile_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@FirstName", model.FirstName);
                    paramCollection.AddWithValue("@MiddleName", model.MiddleName);
                    paramCollection.AddWithValue("@LastName", model.LastName);
                    paramCollection.AddWithValue("@DateOfBirth", model.DateOfBirth);
                    paramCollection.AddWithValue("@Gender", model.Gender);
                    paramCollection.AddWithValue("@AvatarUrl", model.AvatarUrl);
                    paramCollection.AddWithValue("@BgImageUrl", model.BgImageUrl);
                    paramCollection.AddWithValue("@Bio", model.Bio);
                    paramCollection.AddWithValue("@Id", model.Id);
                });
        }

        //PUT CURRENT USER
        public void PutCurrentUser(PublicProfileResponse model)
        {
            DataProvider.ExecuteNonQuery("Users_PublicProfile_UpdateByUserBaseId",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserBaseId", model.UserBaseId);
                    paramCollection.AddWithValue("@FirstName", model.FirstName);
                    paramCollection.AddWithValue("@MiddleName", model.MiddleName);
                    paramCollection.AddWithValue("@LastName", model.LastName);
                    paramCollection.AddWithValue("@DateOfBirth", model.DateOfBirth);
                    paramCollection.AddWithValue("@Gender", model.Gender);
                    paramCollection.AddWithValue("@AvatarUrl", model.AvatarUrl);
                    paramCollection.AddWithValue("@BgImageUrl", model.BgImageUrl);
                    paramCollection.AddWithValue("@Bio", model.Bio);
                    paramCollection.AddWithValue("@StreetAddress", model.StreetAddress);
                    paramCollection.AddWithValue("@PostalCode", model.PostalCode);
                    paramCollection.AddWithValue("@AddressId", model.AddressId);
                    paramCollection.AddWithValue("@AthleteId", model.AthleteId);
                    paramCollection.AddWithValue("@Position", model.Position);
                    paramCollection.AddWithValue("@IsProfessional", model.IsProfessional);
                    paramCollection.AddWithValue("@Weight", model.Weight);
                    paramCollection.AddWithValue("@Height", model.Height);
                    paramCollection.AddWithValue("@Nickname", model.Nickname);
                    paramCollection.AddWithValue("@Birthplace", model.Birthplace);
                    paramCollection.AddWithValue("@Team", model.Team);
                    paramCollection.AddWithValue("@FBUrl", model.FBUrl);
                    paramCollection.AddWithValue("@TwitterUrl", model.TwitterUrl);
                    paramCollection.AddWithValue("@IGUrl", model.IGUrl);
                    paramCollection.AddWithValue("@YTUrl", model.YTUrl);
                    paramCollection.AddWithValue("@AthleteTypeId", model.AthleteTypeId);
              
                });
        }

        //DELETE USER
        public void Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.Users_UserProfile_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@id", id);
                });
           
        }

        
    }
}
