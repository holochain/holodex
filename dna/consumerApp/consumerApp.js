function genesis()
{
  if(VolunteerNode == true)
  {
    var addSelfAsAnchor = {Anchor_Type="IndexNodes",Anchor_Text=App.Key.Hash};

    var anchorMain = {Anchor_Type:"Anchor_Type",Anchor_Text:""};

    var amhash = makeHash(anchorMain);

    var checkexist = get(amhash,{GetMask:HC.GetMask.Suorces});

    if(checkexist.C != JSON.stringify(anchorMain)){

      call("anchor","addAnchor","");
      var IndexNodeAnchorType = {Anchor_Type:"IndexNodes",Anchor_Text=""};
      call("anchor","anchor_type_create",IndexNodeAnchorType);

      call("anchor","anchor_create",addSelfAsAnchor);
    }
    else {
       call("anchor","anchor_create",addSelfAsAnchor);
    }
  }
}

function selectIndexNode()
{

  var indexNodes = call("anchor","anchor_list","IndexNodes");
  var IndexNodesjs = JSON.parse(indexNodes);

  var numberOfIndexNodes = IndexNodesjs.length;
  debug("Number of index nodes : "+numberOfIndexNodes);

  var selectedNumber = Math.floor(Math.random()*numberOfIndexNodes);

  var key = IndexNodesjs[selectedNumber].Anchor_Text;

  return key;
}

function indexObject(object)
{
  var indexNode = selectIndexNode();
  var objHash = makeHash(object);
  var createIndex = send(indexNode,{type:"createIndex",content:object.content,hashOfObject=objHash,language:"English"});
}

function searchContent(StringOfsearchKeywords)
{
  var indexNode = selectIndexNode();
  var searchResults = send(searchKeywords,{type:"searchKeywords",searchString=StringOfsearchKeywords});
}
