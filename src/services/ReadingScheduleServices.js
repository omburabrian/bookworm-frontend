import apiClient from "./services";

export default {
    getBooks() {
        return apiClient.get("readingSchedule");
      },
    
      getBook(id) {
        return apiClient.get("readingSchedule/" + id);
      }
    };
  







  
  






  
  




  
  







  
  





