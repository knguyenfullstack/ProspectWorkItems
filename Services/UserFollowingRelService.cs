using Prospect.Models.Domain.Blogs;
using Prospect.Models.Requests.Blogs;
using Prospect.Models.Requests.Workouts;
using Prospect.Services.Interfaces.Blogs;
using Prospect.Services.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prospect.Services.Blogs
{
    public class UserFollowingRelService : BaseService, IUserFollowingRelService
    {
        IAuthenticationService _authService;

        public UserFollowingRelService(IAuthenticationService authService) 
        {
             _authService = authService;//added by patric
        }

        public List<UserFollowingRel> GetAll()
        {
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectAll",
            inputParamMapper: null,
            singleRecordMapper: (IDataReader reader, short set) =>
            {
                list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });
            return list;
        }

        public List<UserFollowingRel> GetById(int Id)
        {
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectById",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@id", Id);
            },
            singleRecordMapper: (IDataReader reader, short set) =>
            {
                list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });
            return list;
        }


        //ADDED BY PATRIC******************************************************************************
        public List<UserFollowingRel> GetAllFanInfoByAthlete(UserFollowingRelSortAddRequest model)
        {
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectAllInfoByFollowedByUserId",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@followedByUserId", _authService.GetCurrentUserId());
                paramCollection.AddWithValue("@pageNumber", model.PageNumber);
                paramCollection.AddWithValue("@columnName", model.ColumnName);
                paramCollection.AddWithValue("@checked", model.Checked);
                paramCollection.AddWithValue("@input", model.Input);
                paramCollection.AddWithValue("@recordsPerPage", model.RecordsPerPage);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                    list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });

            return list;
        }
        //ADDED BY PATRIC******************************************************************************


        public void Post(int followingUserId, int followedByUserId)
        {

            DataProvider.ExecuteNonQuery("dbo.Blogs_UserFollowingRel_Insert", //get SQL data
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@followingUserId", followingUserId); //pass SQL data to C#
                    paramCollection.AddWithValue("@followedByUserId", followedByUserId);

                });

        }

        public int Put(UserFollowingRelUpdateRequest model)
        {

            DataProvider.ExecuteNonQuery("dbo.Blogs_UserFollowingRel_Update", //get SQL data
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@followingUserId", model.FollowingUserId); //pass SQL data to C#
                    paramCollection.AddWithValue("@followedByUserId", model.FollowedByUserId);
                    paramCollection.AddWithValue("@createdDate", model.CreatedDate);

                });
            return 0;
        }
        public int Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.Blogs_UserFollowingRel_Delete",
                inputParamMapper: (SqlParameterCollection paramCollection) =>
                {
                    paramCollection.AddWithValue("@id", id);
                });
            return id;
        }
        //ADDED BY KENNY******************************************************************************
        public List<UserFollowingRel> GetAllFanInfoByFan(int Id)
        {
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectAllInfoByFollowingByUserId",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@followingByUserId", Id);
            },
            singleRecordMapper: (IDataReader reader, short set) =>
            {
                list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });
            return list;
        }
        //*****************************************************************************************************
        //ADDED BY KENNY
        public List<UserFollowingRel> GetByFollowedByUserId(int followingUserId, int followedByUserId)
        {
            //generate a list of objects to be returned by the sql command
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            //execute the sql command with two parameters 
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectByFollowingUserIdCheckIfFollowing", //get SQL data
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@followingUserId", followingUserId); //pass SQL data to C#
                    paramCollection.AddWithValue("@followedByUserId", followedByUserId);
                },
            singleRecordMapper: (IDataReader reader, short set) =>
            {
                //map the data we get into a list object that we will return to the controller
                list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });
            return list;

        }
        //ADDED BY KENNY******************************************************************************
        public List<UserFollowingRel> GetAllFanInfoByFanPagination(int Id, UserFollowingRelSortAddRequest model)
        {
            List<UserFollowingRel> list = new List<UserFollowingRel>();
            DataProvider.ExecuteCmd("dbo.Blogs_UserFollowingRel_SelectAllByFollowingByUserIdPagination",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@followingByUserId", Id);
                paramCollection.AddWithValue("@PageNumber", model.PageNumber);
                paramCollection.AddWithValue("@input", model.Input);


            },
            singleRecordMapper: (IDataReader reader, short set) =>
            {
                list.Add(DataMapper<UserFollowingRel>.Instance.MapToObject(reader));
            });
            return list;
        }
    }
}
