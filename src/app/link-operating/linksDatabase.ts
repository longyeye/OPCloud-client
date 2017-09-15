export class dataBase {

  linksArray:any;

  constructor(){

    this.linksArray=[
      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Unidirectional_Relation"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Uni-direct(null tag)"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Uni-direct(null tag)"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Unidirectional_Relation"},
      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Unidirectional_Relation"},
      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Unidirectional_Relation"},
      {sourceType: "object1.state1", targetType1: "object2.state2",targetType2: "null", linkName: "Unidirectional_Relation"},

//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Uni-direct(tag)"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Uni-direct(tag)"},
//      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Uni-direct(tag)"},
//      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Uni-direct(tag)"},
//      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Uni-direct(tag)"},
//      {sourceType: "object1.state1", targetType1: "object2.state2",targetType2: "null", linkName: "Uni-direct(tag)"},

      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Bidirectional_Relation"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Bidirectional_Relation"},
      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Bidirectional_Relation"},
      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Bidirectional_Relation"},
      {sourceType: "object1.state1", targetType1: "object2.state2",targetType2: "null", linkName: "Bidirectional_Relation"},

//      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Bi-direct(tag)"},
//      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Bi-direct(tag)"},
//      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Bi-direct(tag)"},
//      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Bi-direct(tag)"},
//      {sourceType: "object1.state1", targetType1: "object2.state2",targetType2: "null", linkName: "Bi-direct(tag)"},

//      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Bi-direct(ftag, btag)"},
//      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Bi-direct(ftag, btag)"},
//      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Bi-direct(ftag, btag)"},
//      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Bi-direct(ftag, btag)"},
//      {sourceType: "object1.state1", targetType1: "object2.state2",targetType2: "null", linkName: "Bi-direct(ftag, btag)"},

      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Aggregation-Participation"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Aggregation-Participation"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Aggregation-Participation"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Aggregation-Participation"},

      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Exhibition-Characterization"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Exhibition-Characterization"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Exhibition-Characterization"},
      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "process1", targetType1: "object2",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "object1.state", targetType1: "object2",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "object1", targetType1: "object2.state",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Exhibition-Characterization"},
      {sourceType: "process1", targetType1: "object2.state",targetType2: "null", linkName: "Exhibition-Characterization"},

      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Generalization-Specialization"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Generalization-Specialization"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Generalization-Specialization"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Generalization-Specialization"},

      {sourceType: "object1", targetType1: "object2",targetType2: "null", linkName: "Classification-Instantiation"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.2", linkName: "Classification-Instantiation"},
//      {sourceType: "object1", targetType1: "object2.1", targetType2: "object2.n", linkName: "Classification-Instantiation"},
      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Classification-Instantiation"},

      {sourceType: "process1", targetType1: "object2",targetType2: "null", linkName: "Result"},
      {sourceType: "process1", targetType1: "object2.state",targetType2: "null", linkName: "Result"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Consumption"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Consumption"},
     // {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Effect"},



      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Agent"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Agent"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Instrument"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Instrument"},

      {sourceType: "object1.state1", targetType1: "object1.state2",targetType2: "null", linkName: "In-out_link_pair"},
      {sourceType: "object1.state", targetType1: "object1",targetType2: "null", linkName: "In-out_link_pair"},
      {sourceType: "object1", targetType1: "object1.state",targetType2: "null", linkName: "In-out_link_pair"},

      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Split_input"},

      {sourceType: "process1", targetType1: "object2.state",targetType2: "null", linkName: "Split_output"},

      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Invocation"},
     // {sourceType: "process1", targetType1: "process1",targetType2: "null", linkName: "Self_Invocation"},

      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Overtime_exception"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Overtime_exception"},
      {sourceType: "object1.state1", targetType1: "object1.state2",targetType2: "null", linkName: "Overtime_exception"},
      {sourceType: "object1.state", targetType1: "object1",targetType2: "null", linkName: "Overtime_exception"},

      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Undertime_exception"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Undertime_exception"},
      {sourceType: "object1.state1", targetType1: "object1.state2",targetType2: "null", linkName: "Undertime_exception"},
      {sourceType: "object1.state", targetType1: "object1",targetType2: "null", linkName: "Undertime_exception"},

//      {sourceType: "process1", targetType1: "process2",targetType2: "null", linkName: "Undertime_and_overtime_exeption"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Condition_Consumption"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Condition_Consumption"},




      {sourceType: "object1.state1", targetType1: "object1.state2",targetType2: "null", linkName: "Condition_Input"},
      {sourceType: "object1.state", targetType1: "object1",targetType2: "null", linkName: "Condition_Input"},
      {sourceType: "object1", targetType1: "object1.state",targetType2: "null", linkName: "Condition_Input"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Condition_Instrument"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Condition_Instrument"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Condition_Agent"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Condition_Agent"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Event_Consumption"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Event_Consumption"},
      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Effect"},
      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Event_Effect"},
      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Condition_Effect"},
      {sourceType: "process1", targetType1: "object2",targetType2: "null", linkName: "Effect"},
      {sourceType: "process1", targetType1: "object2",targetType2: "null", linkName: "Event_Effect"},
      {sourceType: "process1", targetType1: "object2",targetType2: "null", linkName: "Condition_Effect"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Event_Instrument"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Event_Instrument"},

      {sourceType: "object1", targetType1: "process2",targetType2: "null", linkName: "Event_Agent"},
      {sourceType: "object1.state", targetType1: "process2",targetType2: "null", linkName: "Event_Agent"}
    ];
  }
}
