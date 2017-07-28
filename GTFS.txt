CKAN Data API 
Access resource data via a web API with powerful query support. Further information in the main CKAN Data API and DataStore documentation.
Endpoints » 
The Data API can be accessed via the following actions of the CKAN action API.

Query
https://data.qld.gov.au/api/action/datastore_search
Query (via SQL)
https://data.qld.gov.au/api/action/datastore_search_sql
Querying » 
Query example (first 5 results) 
https://data.qld.gov.au/api/action/datastore_search?resource_id=be7f19e5-3ee8-4396-b9eb-46f6b4ce8039&limit=5 
Query example (results containing 'jones') 
https://data.qld.gov.au/api/action/datastore_search?resource_id=be7f19e5-3ee8-4396-b9eb-46f6b4ce8039&q=jones 
Query example (via SQL statement) 
https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT * from "be7f19e5-3ee8-4396-b9eb-46f6b4ce8039" WHERE title LIKE 'jones' 
Example: Javascript » 
A simple ajax (JSONP) request to the data API using jQuery.
  var data = {
    resource_id: 'be7f19e5-3ee8-4396-b9eb-46f6b4ce8039', // the resource id
    limit: 5, // get 5 results
    q: 'jones' // query for 'jones'
  };
  $.ajax({
    url: 'https://data.qld.gov.au/api/action/datastore_search',
    data: data,
    dataType: 'jsonp',
    success: function(data) {
      alert('Total results found: ' + data.result.total)
    }
  });
Example: Python » 
import urllib
url = 'https://data.qld.gov.au/api/action/datastore_search?limit=5&q=title:jones'
fileobj = urllib.urlopen(url)
print fileobj.read()
