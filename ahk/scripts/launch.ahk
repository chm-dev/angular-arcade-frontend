Run %1%, , , NewPID
Process, WaitClose, %NewPID%
ExitApp

!^q::
;WinClose, ahk_pid %NewPID%
Process, Close, %NewPID%
ExitApp
