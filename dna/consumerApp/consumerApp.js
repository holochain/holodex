function genesis()
{
  return true;
}

function bridgeGenesis(VolunteerForIndex)                     //Volunteering Ratio to be added
{
  if(VolunteerForIndex == true)
  {
    VolunteerNode = true;
    var addSelfAsAnchor = {Anchor_Type="IndexNodes",Anchor_Text=App.Key.Hash};

    var anchorMain = {Anchor_Type:"Anchor_Type",Anchor_Text:""};

    var amhash = makeHash(anchorMain);

    var checkexist = get(amhash,{GetMask:HC.GetMask.Suorces});

    if(checkexist.C != JSON.stringify(anchorMain)){

      call("anchor","addAnchor","");
      var IndexNodeAnchorType = {Anchor_Type:"IndexNodes",Anchor_Text=""};
      call("anchor","anchor_type_create",IndexNodeAnchorType);

      var lnk = call("anchor","anchor_create",addSelfAsAnchor);
    }
    else {
       var lnk = call("anchor","anchor_create",addSelfAsAnchor);
    }
    return VolunteerNode;
  }
  else
  {
    VolunteerNode = false;
    return VolunteerNode;
  }
}

function selectIndexNode()
{

  if(VolunteerNode == true)
  {
    var key = App.Key.Hash;
  }
  else
  {
    var indexNodes = call("anchor","anchor_list","IndexNodes");
    var IndexNodesjs = JSON.parse(indexNodes);

    var numberOfIndexNodes = IndexNodesjs.length;
    debug("Number of index nodes : "+numberOfIndexNodes);

    var selectedNumber = Math.floor(Math.random()*numberOfIndexNodes);

    var key = IndexNodesjs[selectedNumber].Anchor_Text;
  }
  return key;
}

function createObject1ForTest()
{
  var ContentToIndex1 = {content:"holodex : We are Indexing this content using holodex app. this",details:"can include timestamp, etc."};
  ContentToIndexhash1 = makeHash(ContentToIndex1);
  return ContentToIndexhash1;
}

function createObject2ForTest()
{
  var ContentToIndex2 = {content:"holodex can also be used for searching keywords",details:"can include timestamp,lication, etc."};
  ContentToIndexhash2 = makeHash(ContentToIndex2);
  return ContentToIndexhash1;
}

function indexObject(object)
{
  var indexNode = selectIndexNode();
  var objHash = makeHash(object);
  var createIndex = send(indexNode,{type:"createIndex",content:object.content,hashOfObject=objHash,language:"English"})
  return createIndex;
}

function searchContent(StringOfsearchKeywords)
{
  var indexNode = selectIndexNode();
  var searchResults = send(searchKeywords,{type:"searchKeywords",searchString=StringOfsearchKeywords});
  return searchResults;
}
