import { gql } from 'apollo-boost';

/* Query to fetch the node metric details */
export const nodeMetrics = gql`
{
  nodeMetrics {
    statusCode
    nodeMetrics {
        name
        label
        data{
            name
            capacity
            used
            value
          }
      }
  }
}
`

/* Query to fetch Core tools in Navigation and More page */
const coreTools = gql`
query {
  allTools(toolType:"Core"){
    status_code
    status
    message
    toolDetails{
        name
        display_name
        image
        desc
        version
        tool_type
        is_active
        is_ui
        url
      }
  }
}
`
export { coreTools }


/* Query to fetch NonCore tools in More page */
const nonCoreTools = gql`
query{
  allTools(toolType:"Non-Core"){
    status_code
    status
    message
    toolDetails{
        name
        display_name
        image
        desc
        version
        tool_type
        is_active
        is_ui
        url
    }
  }
}
`
export { nonCoreTools }


/* Query to fetch Cartridges in More Page */
const customTools = gql`
query{
  allTools(toolType:"Custom-Tool"){
    status_code
    status
    message
    toolDetails{
        name
        display_name
        image
        desc
        version
        tool_type
        is_active
        is_ui
        url
    }
  }
}
`
export { customTools }


/* Query to fetch Cartridges in More Page */
const cartridges = gql`
query{
  allTools(toolType:"cartridge"){
      status_code
      status
      message
      cartridge_Order_Id
      cartridgeDetails{
        workspace_name      
        job_details{
          cartridge_name
          cartridge_type
          tools{
            name
          }
          pipelines{
            pipeline_name
            build_path
          }
          version
          is_active          
        }
      }
    }
  }
  `
export { cartridges }


/* Query to fetch Cartridges for last 7 days */
const weeklyBuildDetails = gql`
query fetchWeeklyBuildDetails($workspace_name:String!,$days:Int!){
  fetchWeeklyBuildDetails(workspace_name:$workspace_name,days:$days){
    status_code
    status
    message
    jobDetails{
      job_name
      buildDetails
      {
        Day
        Date
        total_builds
      }
  }
  }
}
`
export { weeklyBuildDetails }


/* Query to fetch Build Details for last 24 hrs */
const hourBuildDetails = gql`
query fetch24HourBuildDetails($workspace_name:String!) {
  fetch24HourBuildDetails(workspace_name:$workspace_name) {
    status_code
    status
    message
    total_cartridgebuilds
    total_success_count
    total_failure_count
    total_aborted_count
    jobDetails{
      jobName
      pipeline_details{
      pipeline_name
      total_builds
      successful_builds
      failed_builds
      aborted_builds
      }
    }
  }
}
`
export { hourBuildDetails }


/* Query to fetch AllToolsDetails in SideNavBar and More Page */
const allToolsData = gql`
query{
  allTools(toolType:"all"){
    status_code
    status
    message
    tools_Order_Id
    toolDetails{
        name
        display_name
        image
        desc
        version
        tool_type
        is_active
        is_ui
        is_pvc
        tool_category
        url
    }
    cartridge_Order_Id
      cartridgeDetails{
        workspace_name      
        job_details{
          cartridge_name
          cartridge_type
          tools{
            name
          }
          pipelines{
            pipeline_name
            build_path
          }
          version
          is_active 
        }
      }
  }
}
 `
export { allToolsData }

/* Query to check username is in ldap for valid Login Credentials  */
const userAuthentication = gql`
 query verifyldapuser($username:String!,$password:String!){
  verifyldapuser(username: $username,password:$password){
         message
         status
         status_code
         queryDetails{
             cn
             username
             mail
             }
             }
 }
 `
export { userAuthentication }
