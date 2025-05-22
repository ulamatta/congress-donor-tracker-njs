// Member types
export interface Member {
  bioguide: string
  fec_id: string
  first: string
  last: string
  party: string
  state: string
  chamber: string
}

// Donor types
export interface Donor {
  employer: string
  total_amt: number
}

// Member detail types
export interface MemberDetail {
  bioguide: string
  name: string
  party: string
  state: string
  chamber: string
  photo: string
  donors: Donor[]
}
