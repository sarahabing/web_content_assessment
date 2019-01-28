ENDPOINTS

GETS:

All Records (paginated): http://localhost:3000/getRecords
Filter based on reason, type, and dates: http://localhost:3000/filter?date1=2019-01-01&date2=2019-01-31&reason=transfer&type=call


POST:
http://localhost:3000/create
Body: -enter whatever values you wish for communication_type, reason, and direction

      {
          "person_id": "888",
          "communication_date": "2019-01-26",
          "communication_type": "boi",
          "reason": "boi",
          "direction": "boi"
      }

PUT (not used):
http://localhost:3000/editUser/888

888 is the person_id param you'll need to make this work (I wouldn't do anything else
since this will change ALL the records)


DELETE (not used):
http://localhost:3000/deleteUser/888

888 is the person_id param you'll need to make this work (I wouldn't do anything else
since this will delete ALL the records)
