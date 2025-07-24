use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mint_account = next_account_info(accounts_iter)?;
    let authority_account = next_account_info(accounts_iter)?;

    if mint_account.owner != program_id {
        msg!("Mint account not owned by program");
        return Err(ProgramError::InvalidAccountData);
    }

    msg!("Minting 1000 HungerCoin to {}", authority_account.key);
    // Placeholder for minting logic (to be expanded with token program integration)
    // Will include USD pegging mechanism and transfer to FeedHunger.org users

    Ok(())
}

// Copyright © 2025 HungerCoin ™
