struct Batch {
  1: double am1,
  2: string cur1,
  3: string cur2,
}

service Converter {
   double convert(1:i32 logid, 2:Batch batch),
   map <string, double> getCurrencies(),
}
