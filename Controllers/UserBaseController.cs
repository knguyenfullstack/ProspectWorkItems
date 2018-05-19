using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Prospect.Models.Domain;
using Prospect.Models.Domain.Users;
using Prospect.Models.Domain.Email;
using Prospect.Models.Requests.Users;
using Prospect.Models.Responses;
using Prospect.Services;
using Prospect.Services.Interfaces.Email;
using Prospect.Services.Interfaces.Logs;
using Prospect.Services.Interfaces.Users;
using static Prospect.Services.Email.EmailTemplate;
using Prospect.Services.Email;

namespace Prospect.Web.Controllers.Api.Users
{
    [AllowAnonymous]
    [RoutePrefix("api/userbases")]
    public class UserBaseController : ApiController
    {
        IUserBaseService _userBaseService;
        IUserService _userService;
        IErrorLogService _errorLogService;
        IEmailTemplate _emailTemplate;

        //////////////////////////////////
        ISendgridService _sendgridService;
        IGmailService _gmailService;
        //////////////////////////////////
        public UserBaseController(IUserBaseService userBaseService, IUserService userService, ISendgridService sendgridService, IErrorLogService errorLogService, IGmailService gmailService, IEmailTemplate emailTemplate)
        {
            _userBaseService = userBaseService;
            _userService = userService;
            _sendgridService = sendgridService;
            _gmailService = gmailService;
            _errorLogService = errorLogService;
            _emailTemplate = emailTemplate;
        }

        [Route(), HttpGet]
        public IHttpActionResult GetAll()
        {
            try
            {
                ItemsResponse<UserBase> response = new ItemsResponse<UserBase>
                {
                    Items = _userBaseService.GetAll() // put the result of this function into items
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }
        [Route("{id:int}"), HttpGet]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                ItemResponse<UserBase> response = new ItemResponse<UserBase>
                {
                    Item = _userBaseService.GetById(id) // put the result of this function into items
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }
        [Route(), HttpPost]
        public IHttpActionResult Registration(UserBaseAddRequest model)
        {
            try
            {

                if (!ModelState.IsValid) { return BadRequest(ModelState); }
                string token = "";
                string email = model.Email;

                token = _userService.Create(model);
                EmailBody eb = new EmailBody
                {
                    Token = token,
                    TemplateType = EmailFileType.REGISTER
                };

                //*************GMAIL INJECTION CODE TEST FOR SENDING ONE EMAIL TO A SINGLE EMAIL*************

                // Note: Service must include 'To', 'Subject', and 'Body'. 'Body' may include HTML
                _gmailService.SendSingleEmail(new GmailContent
                {
                    To = new EmailUserObj { Email = email },
                    Subject = "Thank You For Registering",
                    //Body = "Thank you for Registering with Prospect. Click Here to LogIn. http://localhost:3024/home/registerValidation/" + token
                    Body = _emailTemplate.CreateEmailBody(eb)
                });

                return Ok(new ItemResponse<string> { Item = "success" });


            }
            catch (Exception ex)
            {
                return Ok(new ItemResponse<string> { Item = ex.Message });
            }
        }
        [Route("resend"), HttpPost]
        public IHttpActionResult ResendValidation(UserBaseAddRequest model)
        {
            try
            {
                string token = model.Token;
                string email = model.Email;

                //*************GMAIL INJECTION CODE TEST FOR SENDING ONE EMAIL TO A SINGLE EMAIL*************

                // Note: Service must include 'To', 'Subject', and 'Body'. 'Body' may include HTML
                _gmailService.SendSingleEmail(new GmailContent
                {
                    To = new EmailUserObj { Email = email },
                    Subject = "Thank You For Registering",
                    Body = "Thank you for Registering with Prospect. Click Here to LogIn. http://localhost:3024/home/registerValidation/" + token
                });

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("{token}"), HttpGet]//selects this route if we get here by adding a token to the api url
        public IHttpActionResult RegisterValidation(string token)
        {
            try
            {

                _userBaseService.CheckIfTokenIsValid(token);

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message);
            }
        }
        [Route(), HttpPut]
        public IHttpActionResult Put(UserBaseUpdateRequest model)
        {
            try
            {

                if (!ModelState.IsValid) { return BadRequest("invalid model!"); }
                _userBaseService.Put(model); // change

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message);
            }
        }
        [Route("{id:int}"), HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                if (!ModelState.IsValid) { return BadRequest("invalid model!"); }
                _userBaseService.Delete(id); // change

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message);
            }
        }
        //endpoint for logging in rest client
        [Route("login"), HttpPost]
        public IHttpActionResult Login(LoginRequest model)
        {
            try
            {

                string result = _userService.LogIn(model.Email, model.Password);

                switch (result)
                {
                    case "unverified":
                        UserBaseAddRequest newModel = new UserBaseAddRequest();
                        newModel.Email = model.Email;
                        string token = _userBaseService.GetRegTokenByEmail(newModel);
                        return Ok(new ItemResponse<string> { Item = token });
                    default:
                        return Ok(new ItemResponse<string> { Item = result });
                }
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }
        [Route("currentuser"), HttpGet]
        public IHttpActionResult GetCurrentUser()
        {
            try
            {
                int x = _userService.GetCurrentUser();

                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _userService.GetCurrentUser() // put the result of this function into items
                };
                return Ok(response);
            }

            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }
        [Route("isLoggedIn"), HttpGet]
        public IHttpActionResult IsLoggedIn()
        {
            try
            {
                int x = _userService.GetCurrentUser();
                bool isLoggedIn = false;
                if (x >= 0)
                {
                    isLoggedIn = true;
                }
                ItemResponse<bool> response = new ItemResponse<bool>
                {
                    Item = isLoggedIn // put the result of this function into items
                };
                return Ok(response);
            }

            catch (Exception)
            {
                return Ok(false); //show us the exception msg
            }
        }

        [Route("getalltags"), HttpGet]
        public IHttpActionResult GetAllUserTags()
        {
            try
            {
                ItemsResponse<UserTags> response = new ItemsResponse<UserTags>
                {
                    Items = _userBaseService.GetAllUserTags() // put the result of this function into items
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }

        [Route("getroles"), HttpGet]
        public IHttpActionResult GetUserRoles()
        {
            try
            {
                int id = _userService.GetCurrentUser();

                ItemsResponse<string> response = new ItemsResponse<string>
                {
                    Items = _userBaseService.GetUserRoles(id) // put the result of this function into items
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }

        [Route("getdashboard"), HttpGet]
        public IHttpActionResult GetDashboardOrder()
        {
            try
            {
                int id = _userService.GetCurrentUser();

                ItemResponse<string> response = new ItemResponse<string>
                {
                    Item = _userBaseService.GetDashboardOrder(id) // put the result of this function into items
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }

        [Route("updatedashboard"), HttpPost]
        public IHttpActionResult UpdateDashboardOrder(DashboardOrder order)
        {
            try
            {
                int id = _userService.GetCurrentUser();

                _userBaseService.UpdateDashboardOrder(id, order.Order); // put the result of this function into items

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }

        [Route("logout"), HttpGet]
        public IHttpActionResult Logout()
        {
            try
            {
                _userService.Logout();

                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                _errorLogService.Post(new Models.Requests.Logs.ErrorLogAddRequest
                {
                    ErrorSourceTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name
                });
                return BadRequest(ex.Message); //show us the exception msg
            }
        }
    }
}
