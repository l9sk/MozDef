-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at http://mozilla.org/MPL/2.0/.
-- Copyright (c) 2014 Mozilla Corporation
--
-- Contributors:
-- Anthony Verez averez@mozilla.com
-- Mike Trinkala mtrinkala@mozilla.com
-- Jeff Bryner jbryner@mozilla.com

local l=require "lpeg"
local string=require "string"
l.locale(l) --add locale entries in the lpeg table
local space = l.space^0  --define a space constant
local sep = l.P"\t"
local elem = l.C((1-sep)^0)
grammar = l.Ct(elem * (sep * elem)^0) -- split on tabs, return as table

function process_message()
    local log = read_message("Payload")

    --set a default msg that heka's
    --message matcher will ignore
    local msg = {
        Type = "IGNORE",
        Fields={}
    }    

    local matches = grammar:match(log)
    if not matches then
        --return 0 to not propogate errors to heka's log.
        --return a message with IGNORE type to not match heka's message matcher
        inject_message(msg)
        return 0 
    end
    msg['Type']='brointel'
    msg['Logger']='nsm'
    msg.Fields['ts'] = matches[1]
    msg.Fields['uid'] = matches[2]
    msg.Fields['sourceipaddress'] = matches[3]
    msg.Fields['sourceport'] = matches[4]
    msg.Fields['destinationipaddress'] = matches[5]
    msg.Fields['destinationport'] = matches[6]
    msg.Fields['fuid'] = matches[7]
    msg.Fields['filemimetype'] = matches[8]
    msg.Fields['filedesc'] = matches[9]
    msg.Fields['seenindicator'] = matches[10]
    msg.Fields['seenwhere'] = matches[11]
    msg.Fields['seenindicatortype'] = matches[12]
    msg.Fields['sources'] = matches[13]
    msg.Fields['summary'] = "Bro intel match: " .. msg.Fields['seenindicator']
    inject_message(msg)
    return 0
end
