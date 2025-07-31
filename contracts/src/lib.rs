use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
};

use spl_token::instruction::mint_to;

// Declare the Solana entrypoint
entrypoint!(process_instruction);

/// Processes the HungerCoin mint instruction
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8], // Placeholder: could add support for amount in future
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Account expected order:
    // 0. Mint account
    // 1. Recipient token account (associated token account)
    // 2. Mint authority (signer)
    // 3. Token program (SPL token)

    let mint_account = next_account_info(accounts_iter)?;
    let recipient_account = next_account_info(accounts_iter)?;
    let authority_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;

    // Ensure the mint authority is signing the transaction
    if !authority_account.is_signer {
        msg!("Mint authority signature missing");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let amount: u64 = 1_000; // Mint 1000 HungerCoin (use 6 or 9 decimals if needed)

    msg!("Minting {} HungerCoin to {}", amount, recipient_account.key);

    // Create the mint_to instruction from SPL Token program
    let ix = mint_to(
        token_program.key,
        mint_account.key,
        recipient_account.key,
        authority_account.key,
        &[], // No multisig signer
        amount,
    )?;

    // Invoke the instruction
    invoke_signed(
        &ix,
        &[
            mint_account.clone(),
            recipient_account.clone(),
            authority_account.clone(),
            token_program.clone(),
        ],
        &[], // Add PDA signer seeds here if using program-owned mint
    )?;

    msg!("✅ Mint successful.");

    Ok(())
}

// Copyright © 2025 HungerCoin ™
