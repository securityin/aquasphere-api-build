"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abi = void 0;
const abi = {
  "metadataVersion": "0.1.0",
  "source": {
    "hash": "0xb0004b735b2660f239f69a7128e527c120a849366443856335d30b1dc5f56d9e",
    "language": "ink! 3.0.0-rc3",
    "compiler": "rustc 1.48.0-nightly"
  },
  "contract": {
    "name": "entropy",
    "version": "0.1.2",
    "authors": ["Gavin Fu <gavfu@outlook.com>"]
  },
  "spec": {
    "constructors": [{
      "args": [{
        "name": "initial_supply",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }, {
        "name": "name",
        "type": {
          "displayName": ["String"],
          "type": 1
        }
      }, {
        "name": "symbol",
        "type": {
          "displayName": ["String"],
          "type": 1
        }
      }, {
        "name": "decimals",
        "type": {
          "displayName": ["u32"],
          "type": 2
        }
      }],
      "docs": ["Creates a new Entropy contract with the specified initial supply, name, symbol and decimals."],
      "name": ["construct"],
      "selector": "0x3c8b9a61"
    }, {
      "args": [{
        "name": "initial_supply",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": ["Creates a new Entropy contract with the specified initial supply and default name, symbol and decimals."],
      "name": ["new"],
      "selector": "0x9bae9d5e"
    }, {
      "args": [],
      "docs": ["Creates a new Entropy contract with default initial supply, name, symbol and decimals."],
      "name": ["default"],
      "selector": "0xed4b9d1b"
    }],
    "docs": [],
    "events": [{
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "basis_points_rate",
        "type": {
          "displayName": ["u128"],
          "type": 3
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "maximum_fee",
        "type": {
          "displayName": ["u128"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when params are set."],
      "name": "Params"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "from",
        "type": {
          "displayName": ["Option"],
          "type": 18
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "to",
        "type": {
          "displayName": ["Option"],
          "type": 18
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when a token transfer occurs."],
      "name": "Transfer"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "owner",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "spender",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when an approval occurs that `spender` is allowed to withdraw", " up to the amount of `value` tokens from `owner`."],
      "name": "Approval"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "amount",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when new tokens are issued"],
      "name": "Issue"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "amount",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when new tokens are redeemed"],
      "name": "Redeem"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "private",
        "type": {
          "displayName": ["bool"],
          "type": 14
        }
      }],
      "docs": [" Event emitted when an account's privacy is updated"],
      "name": "Privacy"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Event emitted when an account is blacklisted"],
      "name": "AddedBlackList"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Event emitted when an account is removed from blacklist"],
      "name": "RemovedBlackList"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "docs": [],
        "indexed": true,
        "name": "funds",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Event emitted when a blacklisted account's fund is destroyed"],
      "name": "DestroyedBlackFunds"
    }, {
      "args": [{
        "docs": [],
        "indexed": true,
        "name": "error",
        "type": {
          "displayName": ["String"],
          "type": 1
        }
      }],
      "docs": [" Event emitted when error occurs"],
      "name": "TransactionFailed"
    }],
    "messages": [{
      "args": [],
      "docs": [" Returns the token name."],
      "mutates": false,
      "name": ["name"],
      "payable": false,
      "returnType": {
        "displayName": ["String"],
        "type": 1
      },
      "selector": "0x3adaf70d"
    }, {
      "args": [],
      "docs": [" Returns the token symbol."],
      "mutates": false,
      "name": ["symbol"],
      "payable": false,
      "returnType": {
        "displayName": ["String"],
        "type": 1
      },
      "selector": "0x9bd1933e"
    }, {
      "args": [],
      "docs": [" Returns the token decimals."],
      "mutates": false,
      "name": ["decimals"],
      "payable": false,
      "returnType": {
        "displayName": ["u32"],
        "type": 2
      },
      "selector": "0x81c09d87"
    }, {
      "args": [],
      "docs": [" Returns contract level transaction fee basic points rate (*/10000)"],
      "mutates": false,
      "name": ["basis_points_rate"],
      "payable": false,
      "returnType": {
        "displayName": ["u128"],
        "type": 3
      },
      "selector": "0x6a1d94fb"
    }, {
      "args": [],
      "docs": [" Returns contract level maximum fee per transaction"],
      "mutates": false,
      "name": ["maximum_fee"],
      "payable": false,
      "returnType": {
        "displayName": ["u128"],
        "type": 3
      },
      "selector": "0x876922b0"
    }, {
      "args": [{
        "name": "new_basic_points",
        "type": {
          "displayName": ["u128"],
          "type": 3
        }
      }, {
        "name": "new_max_fee",
        "type": {
          "displayName": ["u128"],
          "type": 3
        }
      }],
      "docs": [" Set contract level transaction fee params"],
      "mutates": true,
      "name": ["set_params"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x158c977c"
    }, {
      "args": [],
      "docs": [" Returns the contract owner."],
      "mutates": false,
      "name": ["owner"],
      "payable": false,
      "returnType": {
        "displayName": ["AccountId"],
        "type": 4
      },
      "selector": "0xfeaea4fa"
    }, {
      "args": [],
      "docs": [" Returns the total token supply."],
      "mutates": false,
      "name": ["total_supply"],
      "payable": false,
      "returnType": {
        "displayName": ["Balance"],
        "type": 3
      },
      "selector": "0xdb6375a8"
    }, {
      "args": [{
        "name": "owner",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Returns the account balance for the specified `owner`.", "", " Returns `0` if the account is non-existent."],
      "mutates": false,
      "name": ["balance_of"],
      "payable": false,
      "returnType": {
        "displayName": ["Balance"],
        "type": 3
      },
      "selector": "0x0f755a56"
    }, {
      "args": [{
        "name": "owner",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "spender",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Returns the amount which `spender` is still allowed to withdraw from `owner`.", "", " Returns `0` if no allowance has been set `0`."],
      "mutates": false,
      "name": ["allowance"],
      "payable": false,
      "returnType": {
        "displayName": ["Balance"],
        "type": 3
      },
      "selector": "0x6a00165e"
    }, {
      "args": [{
        "name": "new_owner",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Transfer ownership to another account"],
      "mutates": true,
      "name": ["transfer_ownership"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x107e33ea"
    }, {
      "args": [{
        "name": "to",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Transfers `value` amount of tokens from the caller's account to account `to`.", "", " On success a `Transfer` event is emitted.", "", " # Errors", "", " Returns `InsufficientBalance` error if there are not enough tokens on", " the caller's account balance."],
      "mutates": true,
      "name": ["transfer"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x84a15da1"
    }, {
      "args": [{
        "name": "spender",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Allows `spender` to withdraw from the caller's account multiple times, up to", " the `value` amount.", "", " If this function is called again it overwrites the current allowance with `value`.", "", " An `Approval` event is emitted."],
      "mutates": true,
      "name": ["approve"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x681266a0"
    }, {
      "args": [{
        "name": "from",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "to",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Transfers `value` tokens on the behalf of `from` to the account `to`.", "", " This can be used to allow a contract to transfer tokens on ones behalf and/or", " to charge fees in sub-currencies, for example.", "", " On success a `Transfer` event is emitted.", "", " # Errors", "", " Returns `InsufficientAllowance` error if there are not enough tokens allowed", " for the caller to withdraw from `from`.", "", " Returns `InsufficientBalance` error if there are not enough tokens on", " the the account balance of `from`."],
      "mutates": true,
      "name": ["transfer_from"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x0b396f18"
    }, {
      "args": [{
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Issues `value` amount of tokens to contract owner's account. Only contract owner is allowed to call this function.", " ", " On success a `Issue` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner."],
      "mutates": true,
      "name": ["issue"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0xc392ba4d"
    }, {
      "args": [{
        "name": "value",
        "type": {
          "displayName": ["Balance"],
          "type": 3
        }
      }],
      "docs": [" Redeem `value` amount of tokens from contract owner's account. Only contract owner is allowed to call this function.", " ", " On success a `Redeem` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner.", " Returns `InsufficientBalance` error if owner's balance is insufficient."],
      "mutates": true,
      "name": ["redeem"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0xec3e9290"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }, {
        "name": "private",
        "type": {
          "displayName": ["bool"],
          "type": 14
        }
      }],
      "docs": [" Set whether an account is private or not", " ", " On success a `Privacy` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner."],
      "mutates": true,
      "name": ["set_account_private"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0xd7641771"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Returns whether an account is private"],
      "mutates": false,
      "name": ["is_account_private"],
      "payable": false,
      "returnType": {
        "displayName": ["bool"],
        "type": 14
      },
      "selector": "0xaf9f1f7b"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Returns whether an account is blacklisted"],
      "mutates": false,
      "name": ["is_account_blacklisted"],
      "payable": false,
      "returnType": {
        "displayName": ["bool"],
        "type": 14
      },
      "selector": "0x5fada0d2"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Add an account to blacklist", " ", " On success an `AddedBlackList` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner."],
      "mutates": true,
      "name": ["add_account_to_blacklist"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x9ac6f78a"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Remove an account from blacklist", " ", " On success an `RemovedBlackList` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner."],
      "mutates": true,
      "name": ["remove_account_from_blacklist"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0xd089f91c"
    }, {
      "args": [{
        "name": "account",
        "type": {
          "displayName": ["AccountId"],
          "type": 4
        }
      }],
      "docs": [" Destroy funds of a blacklisted account", " ", " On success an `DestroyedBlackFunds` event is emitted.", " ", " # Errors", " ", " Returns `PermissionDenied` error if caller is not the owner, `AccountNotBlackListed` if the account is not blacklisted"],
      "mutates": true,
      "name": ["destroy_black_funds"],
      "payable": false,
      "returnType": {
        "displayName": ["Result"],
        "type": 15
      },
      "selector": "0x83d2c2e0"
    }]
  },
  "storage": {
    "struct": {
      "fields": [{
        "layout": {
          "cell": {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "ty": 1
          }
        },
        "name": "name"
      }, {
        "layout": {
          "cell": {
            "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
            "ty": 1
          }
        },
        "name": "symbol"
      }, {
        "layout": {
          "cell": {
            "key": "0x0200000000000000000000000000000000000000000000000000000000000000",
            "ty": 2
          }
        },
        "name": "decimals"
      }, {
        "layout": {
          "cell": {
            "key": "0x0300000000000000000000000000000000000000000000000000000000000000",
            "ty": 3
          }
        },
        "name": "basis_points_rate"
      }, {
        "layout": {
          "cell": {
            "key": "0x0400000000000000000000000000000000000000000000000000000000000000",
            "ty": 3
          }
        },
        "name": "maximum_fee"
      }, {
        "layout": {
          "cell": {
            "key": "0x0500000000000000000000000000000000000000000000000000000000000000",
            "ty": 4
          }
        },
        "name": "owner"
      }, {
        "layout": {
          "cell": {
            "key": "0x0600000000000000000000000000000000000000000000000000000000000000",
            "ty": 3
          }
        },
        "name": "total_supply"
      }, {
        "layout": {
          "struct": {
            "fields": [{
              "layout": {
                "struct": {
                  "fields": [{
                    "layout": {
                      "cell": {
                        "key": "0x0700000000000000000000000000000000000000000000000000000000000000",
                        "ty": 7
                      }
                    },
                    "name": "header"
                  }, {
                    "layout": {
                      "struct": {
                        "fields": [{
                          "layout": {
                            "cell": {
                              "key": "0x0800000000000000000000000000000000000000000000000000000000000000",
                              "ty": 2
                            }
                          },
                          "name": "len"
                        }, {
                          "layout": {
                            "array": {
                              "cellsPerElem": 1,
                              "layout": {
                                "cell": {
                                  "key": "0x0800000001000000000000000000000000000000000000000000000000000000",
                                  "ty": 8
                                }
                              },
                              "len": 4294967295,
                              "offset": "0x0900000000000000000000000000000000000000000000000000000000000000"
                            }
                          },
                          "name": "elems"
                        }]
                      }
                    },
                    "name": "entries"
                  }]
                }
              },
              "name": "keys"
            }, {
              "layout": {
                "hash": {
                  "layout": {
                    "cell": {
                      "key": "0x0900000001000000000000000000000000000000000000000000000000000000",
                      "ty": 10
                    }
                  },
                  "offset": "0x0800000001000000000000000000000000000000000000000000000000000000",
                  "strategy": {
                    "hasher": "Blake2x256",
                    "postfix": "",
                    "prefix": "0x696e6b20686173686d6170"
                  }
                }
              },
              "name": "values"
            }]
          }
        },
        "name": "balances"
      }, {
        "layout": {
          "struct": {
            "fields": [{
              "layout": {
                "struct": {
                  "fields": [{
                    "layout": {
                      "cell": {
                        "key": "0x0900000001000000000000000000000000000000000000000000000000000000",
                        "ty": 7
                      }
                    },
                    "name": "header"
                  }, {
                    "layout": {
                      "struct": {
                        "fields": [{
                          "layout": {
                            "cell": {
                              "key": "0x0a00000001000000000000000000000000000000000000000000000000000000",
                              "ty": 2
                            }
                          },
                          "name": "len"
                        }, {
                          "layout": {
                            "array": {
                              "cellsPerElem": 1,
                              "layout": {
                                "cell": {
                                  "key": "0x0a00000002000000000000000000000000000000000000000000000000000000",
                                  "ty": 11
                                }
                              },
                              "len": 4294967295,
                              "offset": "0x0b00000001000000000000000000000000000000000000000000000000000000"
                            }
                          },
                          "name": "elems"
                        }]
                      }
                    },
                    "name": "entries"
                  }]
                }
              },
              "name": "keys"
            }, {
              "layout": {
                "hash": {
                  "layout": {
                    "cell": {
                      "key": "0x0b00000002000000000000000000000000000000000000000000000000000000",
                      "ty": 10
                    }
                  },
                  "offset": "0x0a00000002000000000000000000000000000000000000000000000000000000",
                  "strategy": {
                    "hasher": "Blake2x256",
                    "postfix": "",
                    "prefix": "0x696e6b20686173686d6170"
                  }
                }
              },
              "name": "values"
            }]
          }
        },
        "name": "allowances"
      }, {
        "layout": {
          "struct": {
            "fields": [{
              "layout": {
                "struct": {
                  "fields": [{
                    "layout": {
                      "cell": {
                        "key": "0x0b00000002000000000000000000000000000000000000000000000000000000",
                        "ty": 7
                      }
                    },
                    "name": "header"
                  }, {
                    "layout": {
                      "struct": {
                        "fields": [{
                          "layout": {
                            "cell": {
                              "key": "0x0c00000002000000000000000000000000000000000000000000000000000000",
                              "ty": 2
                            }
                          },
                          "name": "len"
                        }, {
                          "layout": {
                            "array": {
                              "cellsPerElem": 1,
                              "layout": {
                                "cell": {
                                  "key": "0x0c00000003000000000000000000000000000000000000000000000000000000",
                                  "ty": 8
                                }
                              },
                              "len": 4294967295,
                              "offset": "0x0d00000002000000000000000000000000000000000000000000000000000000"
                            }
                          },
                          "name": "elems"
                        }]
                      }
                    },
                    "name": "entries"
                  }]
                }
              },
              "name": "keys"
            }, {
              "layout": {
                "hash": {
                  "layout": {
                    "cell": {
                      "key": "0x0d00000003000000000000000000000000000000000000000000000000000000",
                      "ty": 13
                    }
                  },
                  "offset": "0x0c00000003000000000000000000000000000000000000000000000000000000",
                  "strategy": {
                    "hasher": "Blake2x256",
                    "postfix": "",
                    "prefix": "0x696e6b20686173686d6170"
                  }
                }
              },
              "name": "values"
            }]
          }
        },
        "name": "accounts_private"
      }, {
        "layout": {
          "struct": {
            "fields": [{
              "layout": {
                "struct": {
                  "fields": [{
                    "layout": {
                      "cell": {
                        "key": "0x0d00000003000000000000000000000000000000000000000000000000000000",
                        "ty": 7
                      }
                    },
                    "name": "header"
                  }, {
                    "layout": {
                      "struct": {
                        "fields": [{
                          "layout": {
                            "cell": {
                              "key": "0x0e00000003000000000000000000000000000000000000000000000000000000",
                              "ty": 2
                            }
                          },
                          "name": "len"
                        }, {
                          "layout": {
                            "array": {
                              "cellsPerElem": 1,
                              "layout": {
                                "cell": {
                                  "key": "0x0e00000004000000000000000000000000000000000000000000000000000000",
                                  "ty": 8
                                }
                              },
                              "len": 4294967295,
                              "offset": "0x0f00000003000000000000000000000000000000000000000000000000000000"
                            }
                          },
                          "name": "elems"
                        }]
                      }
                    },
                    "name": "entries"
                  }]
                }
              },
              "name": "keys"
            }, {
              "layout": {
                "hash": {
                  "layout": {
                    "cell": {
                      "key": "0x0f00000004000000000000000000000000000000000000000000000000000000",
                      "ty": 13
                    }
                  },
                  "offset": "0x0e00000004000000000000000000000000000000000000000000000000000000",
                  "strategy": {
                    "hasher": "Blake2x256",
                    "postfix": "",
                    "prefix": "0x696e6b20686173686d6170"
                  }
                }
              },
              "name": "values"
            }]
          }
        },
        "name": "accounts_blacklisted"
      }]
    }
  },
  "types": [{
    "def": {
      "primitive": "str"
    }
  }, {
    "def": {
      "primitive": "u32"
    }
  }, {
    "def": {
      "primitive": "u128"
    }
  }, {
    "def": {
      "composite": {
        "fields": [{
          "type": 5,
          "typeName": "[u8; 32]"
        }]
      }
    },
    "path": ["ink_env", "types", "AccountId"]
  }, {
    "def": {
      "array": {
        "len": 32,
        "type": 6
      }
    }
  }, {
    "def": {
      "primitive": "u8"
    }
  }, {
    "def": {
      "composite": {
        "fields": [{
          "name": "last_vacant",
          "type": 2,
          "typeName": "Index"
        }, {
          "name": "len",
          "type": 2,
          "typeName": "u32"
        }, {
          "name": "len_entries",
          "type": 2,
          "typeName": "u32"
        }]
      }
    },
    "path": ["ink_storage", "collections", "stash", "Header"]
  }, {
    "def": {
      "variant": {
        "variants": [{
          "fields": [{
            "type": 9,
            "typeName": "VacantEntry"
          }],
          "name": "Vacant"
        }, {
          "fields": [{
            "type": 4,
            "typeName": "T"
          }],
          "name": "Occupied"
        }]
      }
    },
    "params": [4],
    "path": ["ink_storage", "collections", "stash", "Entry"]
  }, {
    "def": {
      "composite": {
        "fields": [{
          "name": "next",
          "type": 2,
          "typeName": "Index"
        }, {
          "name": "prev",
          "type": 2,
          "typeName": "Index"
        }]
      }
    },
    "path": ["ink_storage", "collections", "stash", "VacantEntry"]
  }, {
    "def": {
      "composite": {
        "fields": [{
          "name": "value",
          "type": 3,
          "typeName": "V"
        }, {
          "name": "key_index",
          "type": 2,
          "typeName": "KeyIndex"
        }]
      }
    },
    "params": [3],
    "path": ["ink_storage", "collections", "hashmap", "ValueEntry"]
  }, {
    "def": {
      "variant": {
        "variants": [{
          "fields": [{
            "type": 9,
            "typeName": "VacantEntry"
          }],
          "name": "Vacant"
        }, {
          "fields": [{
            "type": 12,
            "typeName": "T"
          }],
          "name": "Occupied"
        }]
      }
    },
    "params": [12],
    "path": ["ink_storage", "collections", "stash", "Entry"]
  }, {
    "def": {
      "tuple": [4, 4]
    }
  }, {
    "def": {
      "composite": {
        "fields": [{
          "name": "value",
          "type": 14,
          "typeName": "V"
        }, {
          "name": "key_index",
          "type": 2,
          "typeName": "KeyIndex"
        }]
      }
    },
    "params": [14],
    "path": ["ink_storage", "collections", "hashmap", "ValueEntry"]
  }, {
    "def": {
      "primitive": "bool"
    }
  }, {
    "def": {
      "variant": {
        "variants": [{
          "fields": [{
            "type": 16,
            "typeName": "T"
          }],
          "name": "Ok"
        }, {
          "fields": [{
            "type": 17,
            "typeName": "E"
          }],
          "name": "Err"
        }]
      }
    },
    "params": [16, 17],
    "path": ["Result"]
  }, {
    "def": {
      "tuple": []
    }
  }, {
    "def": {
      "variant": {
        "variants": [{
          "discriminant": 0,
          "name": "PermissionDenied"
        }, {
          "discriminant": 1,
          "name": "InsufficientBalance"
        }, {
          "discriminant": 2,
          "name": "InsufficientAllowance"
        }, {
          "discriminant": 3,
          "name": "AccountNotBlackListed"
        }]
      }
    },
    "path": ["entropy", "entropy", "Error"]
  }, {
    "def": {
      "variant": {
        "variants": [{
          "name": "None"
        }, {
          "fields": [{
            "type": 4,
            "typeName": "T"
          }],
          "name": "Some"
        }]
      }
    },
    "params": [4],
    "path": ["Option"]
  }]
};
exports.abi = abi;