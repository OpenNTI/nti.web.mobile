#!/bin/bash
INTERFACE=./node_modules/dataserverinterface
EDITOR=./node_modules/react-editor-component

rm -rf $INTERFACE
ln -s ../../nti.node.dataserverinterface/ $INTERFACE
rm -rf $EDITOR
ln -s ../../editor/ $EDITOR
